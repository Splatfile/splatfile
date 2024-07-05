import { GameCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCard";
import { AccountCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/AccountCard";
import { ProfileCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ProfileCard";
import {
  AccountLocale,
  IngameLocale,
  ProfileLocale,
} from "@/app/lib/locales/locale";
import { Lang } from "@/app/lib/types/component-props";
import {
  isGameInfo,
  isPlateInfo,
  isUserInfo,
} from "@/app/lib/types/type-checker";
import { Infos } from "@/app/lib/schemas/profile";

type ProfileWrapperProps = {
  infos: Infos;
  isMine: boolean;
  accountLocale: AccountLocale;
  profileLocale: ProfileLocale;
  ingameLocale: IngameLocale;
  lang: Lang;
};

export default function ProfileWrapper(props: ProfileWrapperProps) {
  const { infos, isMine, accountLocale, ingameLocale, profileLocale, lang } =
    props;

  const { gameInfo, plateInfo, userInfo } = infos;

  if (!gameInfo || !plateInfo || !userInfo) {
    throw new Error("ProfileWrapper: profile is not valid");
  }

  if (
    !isUserInfo(userInfo) ||
    !isGameInfo(gameInfo) ||
    !isPlateInfo(plateInfo)
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
            userInfo={userInfo}
            plateInfo={plateInfo}
            profileLocale={profileLocale}
            lang={lang}
            isMine={isMine}
            gameInfo={gameInfo}
          />
        </div>
        {/* 인게임 정보 */}
        <div className={"w-full md:w-3/5"}>
          <GameCard
            gameInfo={gameInfo}
            ingameLocale={ingameLocale}
            lang={lang}
            isMine={isMine}
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
          <AccountCard
            userInfo={userInfo}
            accountLocale={accountLocale}
            isMine={isMine}
          />
        </div>
      </div>
    </div>
  );
}
