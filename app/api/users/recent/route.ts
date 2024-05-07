import { SplatfileAdmin } from "@/app/lib/server/splatfile-server";
import { NextResponse } from "next/server";
import { ROUTER } from "@/app/lib/splatfile-client";
import { isUserInfo, UserInfoObject } from "@/app/lib/schemas/profile";
import { Profile } from "@/app/lib/types/supabase-alias";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const admin = new SplatfileAdmin(ROUTER);
    const users = await admin.getRecentUpdatedUsers();
    console.log("users:", users);
    const responseUsers: RecentUsers =
      users
        ?.map((profile) => ({
          userId: profile.user_id,
          name: extractUserName(profile),
          lastUpdated: profile.updated_at,
        }))
        .filter((user) => user.name !== "") ?? [];

    console.log("responseUsers:", responseUsers);
    return NextResponse.json(responseUsers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

type RecentUsers = {
  userId: string;
  name: string;
  lastUpdated: string;
}[];

const extractUserName = (profile: Profile) => {
  let name = "";
  const user = profile.user_info;
  if (!isUserInfo(user)) {
    return name;
  }
  const parsed = UserInfoObject.safeParse(user);
  if (parsed.success) {
    name = parsed.data.twitterInfo?.name || parsed.data.switchInfo?.name || "";
  }
  return name;
};
