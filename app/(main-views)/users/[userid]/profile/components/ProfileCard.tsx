import React from "react";
import { ProfileImage } from "@/app/(main-views)/users/[userid]/profile/components/profile-card/ProfileCard";
import { PlateImage } from "@/app/(main-views)/users/[userid]/profile/components/profile-card/PlateImage";
import { ShareButtonSection } from "@/app/(main-views)/users/[userid]/profile/components/ShareButtonSection";

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
