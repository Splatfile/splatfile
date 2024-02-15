"use client";
import React, { useState } from "react";
import {
  useEditStore,
  useProfileImageUrl,
} from "@/app/lib/hooks/use-profile-store";
import clsx from "clsx";
import Image from "next/image";

import { ProfileModal } from "@/app/users/[userId]/profile/components/profile-card/ProfileModal";

export function ProfileImage() {
  const [open, setOpen] = useState(false);
  const profileImageUrl = useProfileImageUrl();
  const { isMine } = useEditStore();

  return (
    <button
      onClick={() => setOpen(true)}
      disabled={!isMine}
      className={clsx(
        "flex w-full items-center justify-center",
        isMine ? "cursor-pointer" : "cursor-default",
      )}
    >
      <ProfileModal open={open} setOpen={setOpen} />
      <div className={clsx("relative h-full w-full", isMine && "group")}>
        {profileImageUrl ? (
          <Image
            width={480}
            height={960}
            src="/samples/sample_profile.png"
            alt="Sample Profile Image"
          />
        ) : (
          <div
            className={
              "aspect-[2/3]  w-full rounded-t-md border-2 border-dashed border-gray-400 bg-gray-200 group-hover:border-gray-200 group-hover:bg-gray-50"
            }
          ></div>
        )}
        <div
          className={clsx(
            "absolute inset-0 z-10  h-full w-full bg-black bg-opacity-50 group-hover:flex",
            isMine ? "flex" : "hidden",
          )}
        >
          <p className={"m-auto w-full text-white"}>클릭해서 이미지 업로드</p>
        </div>
      </div>
    </button>
  );
}
