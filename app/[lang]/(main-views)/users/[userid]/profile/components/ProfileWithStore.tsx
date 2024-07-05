"use client";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";

import { Locale } from "@/app/lib/locales/locale";
import { Profile } from "@/app/lib/types/supabase-alias";
import { Lang } from "@/app/lib/types/component-props";
import dynamic from "next/dynamic";
import { useGameStore, useUserStore } from "@/app/lib/hooks/use-profile-store";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";

type ProfileWithStoreProps = {
  params: {
    userid: string;
    lang: Lang;
  };
  dictionary: Locale;
  profile: Profile;
};

const StoreSetting = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/StoreSetting"
    ),
  { ssr: false },
);

const DebounceEditing = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/DebounceEditing"
    ),
  { ssr: false },
);

const ProfileWrapper = dynamic(
  () =>
    import(
      "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileWrapper"
    ),
  { ssr: false },
);

export function ProfileWithStore(props: ProfileWithStoreProps) {
  const { dictionary, params, profile } = props;

  const userInfo = useUserStore();
  const gameInfo = useGameStore();
  const plateInfo = useTagStore();

  const infos = {
    userInfo,
    gameInfo,
    plateInfo,
  };

  return (
    <>
      <UserContextWrapper>
        <DebounceEditing
          userId={params.userid}
          lang={params.lang}
          err={dictionary.errLocale}
        />
      </UserContextWrapper>
      <StoreSetting
        profile={profile}
        userId={props.params.userid}
        isMine={true}
      />
      <ProfileWrapper
        lang={props.params.lang}
        infos={infos}
        accountLocale={dictionary.accountLocale}
        ingameLocale={dictionary.ingameLocale}
        profileLocale={dictionary.profileLocale}
        isMine={true}
      />
    </>
  );
}
