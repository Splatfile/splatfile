import { type NextRequest, NextResponse } from "next/server";
import { SplatfileServer } from "@/app/lib/server/splatfile-server";

export async function POST(request: NextRequest) {
  console.log("POST");
  const client = new SplatfileServer("ROUTER");
  const formData = await request.formData();

  const userId = formData.get("userid") as string;

  const user = await client.supabase.auth.getUser();
  console.log("user", user.data.user?.id, userId, formData);
  if (user.data.user?.id !== userId) {
    console.log("User is not the same as the logged in user");

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

  const arrayBuffer = await (file as File).arrayBuffer();

  const key = await client.uploadFile(
    Buffer.from(arrayBuffer),
    userId + ".png",
  );

  return NextResponse.json({
    message: "Upload is Succeed",
    key,
  });
}
