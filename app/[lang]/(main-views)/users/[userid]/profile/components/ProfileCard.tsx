import React from "react";
import { ProfileImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileCard";
import { PlateImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/PlateImage";
import { ShareButtonSection } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ShareButtonSection";
import { Profile } from "@/app/lib/locales/locale";

type ProfileCardProps = {
  profile: Profile;
};

export function ProfileCard(props: ProfileCardProps) {
  const { profile } = props;
  return (
    <div
      className={
        "flex h-full w-full flex-col overflow-visible rounded-lg"
      }
    >
      <div className={"relative mb-8"}>
        <ProfileImage profile={profile} />
        <div className={"absolute -bottom-8 -right-5 w-full z-10"}>
          <PlateImage profile={profile} /> 
        </div>
      </div>
      <ShareButtonSection profile={profile} />
    </div>
  );
}
