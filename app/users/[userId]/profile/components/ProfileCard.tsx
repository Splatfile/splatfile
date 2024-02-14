import React from "react";
import { ProfileImage } from "@/app/users/[userId]/profile/components/profile-card/ProfileCard";

type ProfileCardProps = {};

export function ProfileCard(props: ProfileCardProps) {
  return (
    <div
      className={
        "flex h-full w-full flex-col items-center justify-center overflow-clip rounded-lg bg-amber-200"
      }
    >
      <ProfileImage />
      <div className={"aspect-[7/2] w-full max-w-full bg-amber-700"}>Plate</div>
    </div>
  );
}
