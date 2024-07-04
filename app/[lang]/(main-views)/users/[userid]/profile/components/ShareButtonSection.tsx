"use client";
import { ShareButton } from "@/app/ui/components/ShareButton";
import { XShareButton } from "@/app/ui/components/XShareButton";

import React from "react";
import { ExportProfileImageButton } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ExportProfileImageButton";
import { ProfileLocale } from "@/app/lib/locales/locale";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";

type ShareButtonSectionProps = {
  profileLocale: ProfileLocale;
  userInfo: UserInfo;
  plateInfo: PlateInfo;
  gameInfo: GameInfo;
  isMine: boolean;
};

export function ShareButtonSection(props: ShareButtonSectionProps) {
  const { profileLocale, isMine, ...infoProps } = props;

  if (!isMine) return null;

  return (
    <div className={"flex w-full flex-col gap-3 py-4"}>
      <div
        title={profileLocale.ui_share_button}
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          {profileLocale.ui_share_button}
        </h2>
        <ShareButton
          userInfo={infoProps.userInfo}
          profileLocale={profileLocale}
        />
        <XShareButton
          userInfo={infoProps.userInfo}
          profileLocale={profileLocale}
        />
      </div>
      <div
        title="이미지로 내보내기"
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          {profileLocale.ui_export_button}
        </h2>
        <ExportProfileImageButton
          profileLocale={profileLocale}
          {...infoProps}
        />
      </div>
    </div>
  );
}
