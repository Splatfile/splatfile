import React from "react";
import { ProfileImage } from "@/app/(main-views)/users/[userId]/profile/components/profile-card/ProfileCard";
import { PlateImage } from "@/app/(main-views)/users/[userId]/profile/components/profile-card/PlateImage";

type ProfileCardProps = {};

export function ProfileCard(props: ProfileCardProps) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center overflow-clip rounded-lg bg-amber-200"
      }
    >
      <ProfileImage />
      <PlateImage />
    </div>
  );
}
