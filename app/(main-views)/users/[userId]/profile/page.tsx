import { SERVER_COMPONENT } from "@/app/lib/supabase-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/supabase-client";
import { ProfileWrapper } from "@/app/(main-views)/users/[userId]/profile/components/ProfileWrapper";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/(main-views)/users/[userId]/profile/components/StoreSetting";
import { DebounceEditing } from "@/app/(main-views)/users/[userId]/profile/components/DebounceEditing";
import { baseUrl } from "@/app/plate/lib/const";
import type { Metadata } from "next";
import { UserInfoObject } from "@/app/lib/schemas/profile";

type PageProps = {
  params: {
    userId: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const imageUrl = `${baseUrl}/api/users/${props.params.userId}/profile/og`;

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userId);
  let name = "";
  const parsed = UserInfoObject.safeParse(profile.user_info);
  if (parsed.success) {
    name = parsed.data.twitterInfo?.name || parsed.data.switchInfo?.name || "";
  }

  return {
    title: name + "의 프로필",
    description: name + "의 스플래툰 프로필. 스플랫파일",
    openGraph: {
      images: [
        {
          url: (imageUrl || "") as string,
          width: 700,
          height: 200,
          alt: "초코야 플레이트!",
        },
      ],
    },
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

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userId);

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
