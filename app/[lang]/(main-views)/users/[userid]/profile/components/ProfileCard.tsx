import React from "react";
import { ProfileImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileCard";
import { PlateImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/PlateImage";
import { ShareButtonSection } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ShareButtonSection";
import { Profile } from "@/app/lib/locales/locale";
import { Lang } from "@/app/lib/types/component-props";

type ProfileCardProps = {
  profile: Profile;
  lang: Lang;
};

export function ProfileCard(props: ProfileCardProps) {
  const { profile, lang } = props;
  return (
    <div className={"flex h-full w-full flex-col overflow-visible rounded-lg"}>
      <div className={"relative mb-8"}>
        <ProfileImage profile={profile} />
        <div className={"absolute -bottom-8 -right-5 z-10 w-full"}>
          <PlateImage profile={profile} lang={lang} />
        </div>
      </div>
      <ShareButtonSection profile={profile} />
    </div>
  );
}
