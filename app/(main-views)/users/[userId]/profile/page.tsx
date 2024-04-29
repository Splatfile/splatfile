import {
  createOrGetMyProfile,
  getProfile,
  SERVER_COMPONENT,
} from "@/app/lib/supabase-client";
import {
  createSupabaseServerClient,
  createSupabaseServiceClient,
} from "@/app/lib/server/supabase-client";
import { ProfileWrapper } from "@/app/(main-views)/users/[userId]/profile/components/ProfileWrapper";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/(main-views)/users/[userId]/profile/components/StoreSetting";
import { DebounceEditing } from "@/app/(main-views)/users/[userId]/profile/components/DebounceEditing";
import { baseUrl } from "@/app/plate/lib/const";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export const generateMetadata = async (props: PageProps) => {
  const imageUrl = `${baseUrl}/api/users/${props.params.userId}/profile/og`;

  return {
    title: "프로필",
    description: "스플래툰 프로필. 스플랫파일",
    images: [
      {
        url: (imageUrl || "") as string,
        width: 700,
        height: 200,
        alt: "초코야 플레이트!",
      },
    ],
    locale: "ko_KR",
    type: "website",
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
        <DebounceEditing userId={props.params.userId} />
        <StoreSetting
          profile={profile}
          userId={props.params.userId}
          isMine={true}
        />
        <ProfileWrapper />
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
      <ProfileWrapper />
    </>
  );
}
