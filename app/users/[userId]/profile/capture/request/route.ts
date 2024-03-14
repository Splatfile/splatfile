import {
  createApifyClient,
  requestCapturingProfile,
} from "@/app/lib/server/apify-client";
import { createR2Client, uploadFile } from "@/app/lib/server/cloudflare-r2";
import { createSupabaseServerClient } from "@/app/lib/server/supabase-client";
import {
  createCaptureRequest,
  listCaptureRequest,
  updateCaptureRequest,
} from "@/app/lib/supabase-client";
import { type ActorRun } from "apify";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const appClient = createSupabaseServerClient("ROUTER");

  const user = await appClient.auth.getUser();
  if (user.data.user?.id !== params.userId) {
    return NextResponse.json(
      {
        error: "User is not the same as the logged in user",
      },
      {
        status: 403,
      },
    );
  }

  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  const captureRequests = await listCaptureRequest(
    appClient,
    params.userId,
    {},
    { limit: limit, offset: offset },
  );
  return NextResponse.json(captureRequests);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const appClient = createSupabaseServerClient("ROUTER");
  const apifyClient = createApifyClient();

  const user = await appClient.auth.getUser();
  if (user.data.user?.id !== params.userId) {
    return NextResponse.json(
      {
        error: "User is not the same as the logged in user",
      },
      {
        status: 403,
      },
    );
  }

  const captureRequest = await createCaptureRequest(appClient, params.userId);
  const captureCallback = async (result: ActorRun) => {
    const r2Client = createR2Client();

    const keyValueStoreId = result.defaultKeyValueStoreId;
    const resultFileBinary = (
      await apifyClient.keyValueStore(keyValueStoreId).getRecord("result")
    )?.value as Buffer | undefined;

    if (!resultFileBinary) {
      // TODO: failed reason archiving
      throw new Error("result file is not found");
    }

    const result_img_url = await uploadFile(
      r2Client,
      resultFileBinary,
      "profile.png",
    );

    await updateCaptureRequest(appClient, captureRequest.id, {
      result_img_url: result_img_url,
      completed_at: new Date().toISOString(),
    });
  };

  requestCapturingProfile(apifyClient, params.userId).then((result) =>
    captureCallback(result),
  );

  return NextResponse.json(captureRequest);
}
