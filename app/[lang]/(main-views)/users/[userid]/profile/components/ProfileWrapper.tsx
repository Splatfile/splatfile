import { GameCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCard";
import { AccountCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/AccountCard";
import { ProfileCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileCard";
import { AccountLocale, IngameLocale, ProfileLocale } from "@/app/lib/locales/locale";
import { Lang } from "@/app/lib/types/component-props";
import { isGameInfo, isPlateInfo, isUserInfo } from "@/app/lib/types/type-checker";
import { Profile } from "@/app/lib/types/supabase-alias";

type ProfileWrapperProps = {
  profile: Profile;
  isMine: boolean;
  accountLocale: AccountLocale;
  profileLocale: ProfileLocale;
  ingameLocale: IngameLocale;
  lang: Lang;
};

export default function ProfileWrapper(props: ProfileWrapperProps) {
  const { profile, isMine, accountLocale, ingameLocale, profileLocale, lang } =
    props;

  const { game_info, plate_info, user_info } = profile;

  if (!game_info || !plate_info || !user_info) {
    throw new Error("ProfileWrapper: profile is not valid");
  }

  if (
    !isUserInfo(user_info) ||
    !isGameInfo(game_info) ||
    !isPlateInfo(plate_info)
  ) {
    throw new Error("ProfileWrapper: profile is not valid");
  }

  return (
    <div
      className={"flex flex-col items-stretch overflow-hidden sm:overflow-auto"}
    >
      <div className={"flex h-full flex-col md:flex-row md:items-stretch"}>
        {/* 유저 사진 및 프로필 */}
        <div
          className={
            "flex h-full w-full items-center justify-center p-8 text-white md:w-2/5 md:items-stretch md:p-0 md:py-6"
          }
        >
          <ProfileCard
            userInfo={user_info}
            plateInfo={plate_info}
            profileLocale={profileLocale}
            lang={lang}
            isMine={isMine}
            gameInfo={game_info} />
        </div>
        {/* 인게임 정보 */}
        <div className={"w-full md:w-3/5"}>
          <GameCard
            gameInfo={game_info}
            ingameLocale={ingameLocale}
            lang={lang}
          />
        </div>
      </div>
      <div>
        <div
          className={
            "flex flex-col justify-center gap-2 px-2 py-4 lg:px-8 xl:px-24"
          }
        >
          {/* 계정 정보*/}
          <AccountCard userInfo={user_info} accountLocale={accountLocale} />
        </div>
      </div>
    </div>
  );
}
