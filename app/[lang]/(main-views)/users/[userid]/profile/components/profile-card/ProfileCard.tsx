"use client";
import React, { useState } from "react";
import clsx from "clsx";

import { ProfileModal } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/profile-card/ProfileModal";
import { ProfileLocale } from "@/app/lib/locales/locale";
import { UserInfo } from "@/app/lib/types/type-checker";

type ProfileImageProps = {
  userInfo: UserInfo;
  profileLocale: ProfileLocale;
  isMine: boolean;
};

export function ProfileImage(props: ProfileImageProps) {
  const { userInfo, profileLocale, isMine } = props;
  const [open, setOpen] = useState(false);
  const profileImageUrl = userInfo.profileImageUrl;

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
      <div className={clsx("relative h-full w-full", isMine && "group")}>
        {profileImageUrl ? (
          <img
            width={480}
            height={960}
            src={profileImageUrl}
            alt="Profile Image"
            className={
              "h-full w-full rounded-md border-2 border-gray-200 object-cover"
            }
          />
        ) : (
          <div
            className={
              "aspect-[2/3] w-full rounded-md border-2 border-dashed border-gray-400 bg-gray-200 group-hover:border-gray-200 group-hover:bg-gray-50"
            }
          ></div>
        )}
        <div
          className={clsx(
            "absolute inset-0 z-10 h-full w-full rounded-md bg-black opacity-0 group-hover:flex",
            isMine ? "flex group-hover:opacity-50" : "hidden",
          )}
        >
          <p className={"m-auto w-full text-white"}>
            {profileLocale.ui_image_upload_button}
          </p>
        </div>
      </div>
    </button>
  );
}
