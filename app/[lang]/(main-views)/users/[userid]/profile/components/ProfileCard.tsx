import React from "react";
import { ProfileImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileCard";
import { PlateImage } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/PlateImage";
import { ShareButtonSection } from "@/app/ui/components/ShareButtonSection";

type ProfileCardProps = {};

export function ProfileCard(props: ProfileCardProps) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center overflow-clip rounded-lg"
      }
    >
      <ProfileImage />
      <PlateImage />
      <ShareButtonSection />
    </div>
  );
}
