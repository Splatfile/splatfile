import React from "react";
import { PlateImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/PlateImage";
import { ShareButtonSection } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ShareButtonSection";
import { Lang } from "@/app/lib/types/component-props";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";
import { ProfileLocale } from "@/app/lib/locales/locale";
import { ComponentWrapper } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/common/ComponentWrapper";
import { ProfileImageWithStore } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileImageWithStore";
import { ProfileImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileImage";

type ProfileCardProps = {
  userInfo: UserInfo;
  plateInfo: PlateInfo;
  gameInfo: GameInfo;
  profileLocale: ProfileLocale;
  lang: Lang;
  isMine: boolean;
};

export function ProfileCard(props: ProfileCardProps) {
  const { userInfo, plateInfo, gameInfo, profileLocale, lang, isMine } = props;
  return (
    <div className={"flex h-full w-full flex-col overflow-visible rounded-lg"}>
      <div className={"relative mb-8"}>
        <ComponentWrapper
          isMine={isMine}
          userInfo={userInfo}
          profileLocale={profileLocale}
          componentForClient={ProfileImageWithStore}
          serverOnlyComponent={ProfileImage}
        />
        <div className={"absolute -bottom-8 -right-5 z-10 w-full"}>
          <PlateImage
            plateInfo={plateInfo}
            profile={profileLocale}
            lang={lang}
            isMine={isMine}
          />
        </div>
      </div>
      {isMine && (
        <ShareButtonSection
          isMine={isMine}
          profileLocale={profileLocale}
          userInfo={userInfo}
          gameInfo={gameInfo}
          plateInfo={plateInfo}
        />
      )}
    </div>
  );
}
