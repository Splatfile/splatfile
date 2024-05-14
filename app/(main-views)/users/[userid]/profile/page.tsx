import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";
import { ProfileWrapper } from "@/app/(main-views)/users/[userid]/profile/components/ProfileWrapper";
import { unstable_noStore } from "next/cache";
import { StoreSetting } from "@/app/(main-views)/users/[userid]/profile/components/StoreSetting";
import { DebounceEditing } from "@/app/(main-views)/users/[userid]/profile/components/DebounceEditing";
import { baseUrl } from "@/app/plate/lib/const";
import type { Metadata } from "next";
import { UserInfoObject } from "@/app/lib/schemas/profile";

type PageProps = {
  params: {
    userid: string;
  };
};

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const imageUrl = `${baseUrl}/api/users/${props.params.userid}/profile/og`;

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);
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

  if (user.data.user && user.data.user?.id === props.params.userid) {
    const profile = await client.createOrGetMyProfile();
    return (
      <>
        <DebounceEditing userId={props.params.userid} />
        <StoreSetting
          profile={profile}
          userId={props.params.userid}
          isMine={true}
        />
        <ProfileWrapper />
      </>
    );
  }

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);

  return (
    <>
      <StoreSetting
        profile={profile}
        userId={props.params.userid}
        isMine={true}
      />
      <ProfileWrapper />
    </>
  );
}
