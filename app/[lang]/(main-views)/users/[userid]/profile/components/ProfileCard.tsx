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
        "flex h-full w-full flex-col items-center justify-center overflow-clip rounded-lg"
      }
    >
      <ProfileImage profile={profile} />
      <PlateImage profile={profile} />
      <ShareButtonSection profile={profile} />
    </div>
  );
}
