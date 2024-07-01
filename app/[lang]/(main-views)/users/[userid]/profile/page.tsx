import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";
import { ProfileWrapper } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileWrapper";
import { StoreSetting } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/StoreSetting";
import { DebounceEditing } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/DebounceEditing";
import type { Metadata } from "next";
import { CanvasInfoObject, UserInfoObject } from "@/app/lib/schemas/profile";
import { getDictionary } from "@/app/lib/dictionaries";
import { PageProps } from "@/app/lib/types/component-props";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";

type ProfilePage = PageProps & {
  params: {
    userid: string;
  };
};

export const revalidate = 0;

export const generateMetadata = async (
  props: ProfilePage,
): Promise<Metadata> => {
  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);
  let name = "";
  const parsedUserInfo = UserInfoObject.safeParse(profile.user_info);
  if (parsedUserInfo.success) {
    name =
      parsedUserInfo.data.twitterInfo?.name ||
      parsedUserInfo.data.switchInfo?.name ||
      "";
  }

  let ogImageUrl = "";
  const parsedCanvasInfo = CanvasInfoObject.safeParse(profile.canvas_info);

  if (parsedCanvasInfo.success) {
    ogImageUrl = parsedCanvasInfo.data?.ogImageUrl || "";
  }

  return {
    title: name + "의 프로필",
    description: name + "의 스플래툰 프로필. 스플랫파일",
    openGraph: {
      images: [
        {
          url: (ogImageUrl || "") as string,
          width: 700,
          height: 200,
          alt: "초코야 플레이트!",
        },
      ],
    },
  };
};

export default async function ProfilePage(props: ProfilePage) {
  const client = new SplatfileServer(SERVER_COMPONENT);
  const user = await client.supabase.auth.getUser();
  const dictionary = await getDictionary(props.params.lang);

  if (user.data.user && user.data.user?.id === props.params.userid) {
    const profile = await client.createOrGetMyProfile();
    return (
      <>
        <UserContextWrapper>
          <DebounceEditing
            userId={props.params.userid}
            lang={props.params.lang}
            err={dictionary.err}
          />
        </UserContextWrapper>
        <StoreSetting
          profile={profile}
          userId={props.params.userid}
          isMine={true}
        />

        <ProfileWrapper
          lang={props.params.lang}
          account={dictionary.account}
          ingame={dictionary.ingame}
          profile={dictionary.profile}
        />
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
        isMine={false}
      />
      <ProfileWrapper
        lang={props.params.lang}
        account={dictionary.account}
        ingame={dictionary.ingame}
        profile={dictionary.profile}
      />
    </>
  );
}
