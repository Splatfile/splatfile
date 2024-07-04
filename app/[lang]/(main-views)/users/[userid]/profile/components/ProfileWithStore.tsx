import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";
import DebounceEditing from "./DebounceEditing";
import StoreSetting from "./StoreSetting";
import ProfileWrapper from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileWrapper";
import { Locale } from "@/app/lib/locales/locale";
import { Profile } from "@/app/lib/types/supabase-alias";
import { Lang } from "@/app/lib/types/component-props";

type ProfileWithStoreProps = {
  params: {
    userid: string;
    lang: Lang;
  };
  dictionary: Locale;
  profile: Profile;
};

export async function ProfileWithStore(props: ProfileWithStoreProps) {
  const { dictionary, params, profile } = props;
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
        profile={profile}
        accountLocale={dictionary.accountLocale}
        ingameLocale={dictionary.ingameLocale}
        profileLocale={dictionary.profileLocale}
        isMine={true}
      />
    </>
  );
}
