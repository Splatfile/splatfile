import { SplatfileAdmin } from "@/app/lib/server/splatfile-server";
import { NextResponse } from "next/server";
import { ROUTER } from "@/app/lib/splatfile-client";
import { UserInfoObject } from "@/app/lib/schemas/profile";
import { isUserInfo } from "@/app/lib/types/type-checker";

export const dynamic = "force-dynamic";
export const revalidate = 30;

export async function GET() {
  try {
    const admin = new SplatfileAdmin(ROUTER);
    const users = await admin.getRecentUpdatedUsers();
    const responseUsers: RecentUsers =
      users
        ?.map((profile: ProfileLocale) => ({
          userId: profile.user_id,
          name: extractUserName(profile),
          lastUpdated: profile.updated_at,
        }))
        .filter((user: RecentUser) => user.name !== "") ?? [];

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

type RecentUser = {
  userId: string;
  name: string;
  lastUpdated: string;
};

type RecentUsers = RecentUser[];

const extractUserName = (profile: ProfileLocale) => {
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
