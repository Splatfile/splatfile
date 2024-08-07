import { SERVER_COMPONENT } from "@/app/lib/splatfile-client";
import {
  SplatfileAdmin,
  SplatfileServer,
} from "@/app/lib/server/splatfile-server";

import type { Metadata } from "next";
import { CanvasInfoObject, UserInfoObject } from "@/app/lib/schemas/profile";
import { getDictionary } from "@/app/lib/dictionaries";
import { PageProps } from "@/app/lib/types/component-props";
import { getLocaleByLang } from "@/app/lib/server/locale";
import { unstable_noStore } from "next/cache";
import ProfileWrapper from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileWrapper";
import {
  isGameInfo,
  isPlateInfo,
  isUserInfo,
} from "@/app/lib/types/type-checker";
import { ProfileWithStore } from "./components/ProfileWithStore";

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
  const profile = await admin.getProfileWithoutNotFound(props.params.userid);
  const locale = getLocaleByLang(props.params.lang);

  if (!profile) {
    return {
      title: locale.ogLocale.default_title,
      description: locale.ogLocale.default_description,
    };
  }

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
    title: locale.ogLocale.profile_title.replace("{{name}}", name),
    description: locale.ogLocale.profile_description.replace("{{name}}", name),
    openGraph: {
      type: "profile",
      siteName: "splatfile",
      url: `https://www.splatfile.ink/${props.params.lang}/users/${props.params.userid}/profile`,
      images: [
        {
          url: (ogImageUrl || "") as string,
          width: 600,
          height: 315,
          alt: "splatfile preview image",
        },
      ],
    },
  };
};

export default async function ProfilePage(props: ProfilePage) {
  unstable_noStore();
  const client = new SplatfileServer(SERVER_COMPONENT);
  const user = await client.supabase.auth.getUser();
  const dictionary = await getDictionary(props.params.lang);

  if (user.data.user && user.data.user?.id === props.params.userid) {
    const profile = await client.createOrGetMyProfile();
    return (
      <ProfileWithStore
        dictionary={dictionary}
        profile={profile}
        params={props.params}
      />
    );
  }

  const admin = new SplatfileAdmin(SERVER_COMPONENT);
  const profile = await admin.getProfile(props.params.userid);

  const {
    user_info: userInfo,
    game_info: gameInfo,
    plate_info: plateInfo,
  } = profile;

  if (
    !isUserInfo(userInfo) ||
    !isGameInfo(gameInfo) ||
    !isPlateInfo(plateInfo)
  ) {
    throw new Error("ProfileWrapper: profile is not valid");
  }

  return (
    <ProfileWrapper
      lang={props.params.lang}
      infos={{
        userInfo,
        gameInfo,
        plateInfo,
      }}
      accountLocale={dictionary.accountLocale}
      ingameLocale={dictionary.ingameLocale}
      profileLocale={dictionary.profileLocale}
      isMine={false}
    />
  );
}
