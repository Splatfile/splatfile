import { NextRequest } from "next/server";
import { createSupabaseServiceClient } from "@/app/lib/server/supabase-client";
import { getProfile, ROUTER } from "@/app/lib/supabase-client";
import { CanvasInfoObject } from "@/app/lib/schemas/profile";
import { unstable_noStore } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(
  _: NextRequest,
  ctx: {
    params: {
      userid: string;
    };
  },
) {
  unstable_noStore();

  const adminClient = createSupabaseServiceClient(ROUTER);
  const profile = await getProfile(adminClient, ctx.params.userid);

  const parsed = CanvasInfoObject.safeParse(profile.canvas_info);

  if (!parsed.success) {
    return new Response("Canvas Info is not valid" + parsed.success, {
      status: 500,
    });
  }

  const imageUrl = parsed.data?.ogImageUrl;
  if (!imageUrl) {
    return new Response("Image URL is not valid" + imageUrl, {
      status: 500,
    });
  }

  const image = await fetch(imageUrl);

  return new Response(image.body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
