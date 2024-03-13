import { createSupabaseServerClient } from "@/app/lib/server/supabase-client";
import { type NextRequest, NextResponse } from "next/server";
import { createR2Client, uploadFile } from "@/app/lib/server/cloudflare-r2";

export async function POST(request: NextRequest) {
  const appClient = await createSupabaseServerClient("ROUTER");

  const formData = await request.formData();

  const userId = formData.get("userId") as string;

  const user = await appClient.auth.getUser();
  if (user.data.user?.id !== userId) {
    return NextResponse.json(
      {
        error: "User is not the same as the logged in user",
      },
      {
        status: 403,
      },
    );
  }

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      {
        error: "File is null on form data",
        extra: {
          formData,
        },
      },
      {
        status: 400,
      },
    );
  }
  const client = createR2Client();

  const arrayBuffer = await (file as File).arrayBuffer();

  const key = await uploadFile(client, Buffer.from(arrayBuffer), "temp.png");

  appClient.from("users").update({ profile_image: key }).eq("id", userId);
}
