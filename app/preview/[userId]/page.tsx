import {
  createOrGetMyProfile,
  getProfile,
  SERVER_COMPONENT,
} from "@/app/lib/supabase-client";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/app/lib/server/supabase-client";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/users/[userId]/profile/components/StoreSetting";
import { isUserInfo } from "@/app/lib/schemas/profile";
import { ProfileCanvas } from "@/app/preview/[userId]/components/ProfileCanvas";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export const generateMetadata = async () => {
  const supabaseClient = createSupabaseServerClient(SERVER_COMPONENT);
  const profile = await createOrGetMyProfile(supabaseClient);

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

  const supabaseClient = createSupabaseServerClient(SERVER_COMPONENT);
  const user = await supabaseClient.auth.getUser();

  if (user.data.user && user.data.user?.id === props.params.userId) {
    const profile = await createOrGetMyProfile(supabaseClient);
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

  const adminClient = createSupabaseServiceClient(SERVER_COMPONENT);
  const profile = await getProfile(adminClient, props.params.userId);

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
