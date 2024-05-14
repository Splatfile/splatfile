import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/(main-views)/users/[userId]/profile/components/StoreSetting";
import { ProfileCanvas } from "@/app/(capture-view)/preview/[userId]/components/ProfileCanvas";
import { isUserInfo } from "@/app/lib/types/type-checker";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export const generateMetadata = async (props: PageProps) => {
  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userId);

  const userInfo = profile.user_info;

  if (isUserInfo(userInfo)) {
    const userName =
      userInfo.switchInfo?.name || userInfo.twitterInfo?.name || "";
    return {
      title: userName + " 프로필",
      description: userName + " 스플래툰 프로필. 스플랫파일",
    };
  }

  return {
    title: "프로필",
    description: "스플래툰 프로필. 스플랫파일",
  };
};

export default async function ProfilePage(props: PageProps) {
  unstable_noStore();

  const client = new SplatfileServer(SERVER_COMPONENT);
  const user = await client.supabase.auth.getUser();

  if (user.data.user && user.data.user?.id === props.params.userId) {
    const profile = await client.createOrGetMyProfile();
    return (
      <>
        <StoreSetting
          profile={profile}
          userId={props.params.userId}
          isMine={true}
        />
        <ProfileCanvas />
      </>
    );
  }

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userId);

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userId}
        isMine={true}
      />
      <ProfileCanvas />
    </>
  );
}
