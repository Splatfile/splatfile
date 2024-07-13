"use client";
import { UserInfo } from "@/app/lib/types/type-checker";
import { ProfileLocale } from "@/app/lib/locales/locale";
import clsx from "clsx";
import { ProfileModal } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileModal";
import React, { useState } from "react";
import { ProfileImage } from "./ProfileImage";

type ProfileCardWithStoreProps = {
  userInfo: UserInfo;
  profileLocale: ProfileLocale;
  isMine: boolean;
};

export function ProfileImageWithStore(props: ProfileCardWithStoreProps) {
  const { userInfo, profileLocale, isMine } = props;
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(true)}
      disabled={!isMine}
      className={clsx(
        "flex w-full items-center justify-center",
        isMine ? "cursor-pointer" : "cursor-default",
      )}
    >
      <ProfileModal
        profileLocale={profileLocale}
        open={open}
        setOpen={setOpen}
      />
      <ProfileImage
        isMine={isMine}
        userInfo={userInfo}
        profileLocale={profileLocale}
      />
    </button>
  );
}
