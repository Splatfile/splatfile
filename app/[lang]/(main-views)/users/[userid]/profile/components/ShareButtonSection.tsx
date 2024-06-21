import { ShareButton } from "@/app/ui/components/ShareButton";
import { XShareButton } from "@/app/ui/components/XShareButton";

import React from "react";
import { ExportProfileImageButton } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/ExportProfileImageButton";
import { Profile } from "@/app/lib/locales/locale";

type ShareButtonSectionProps = {
  profile: Profile;
};

export function ShareButtonSection(props: ShareButtonSectionProps) {
  const { profile } = props;

  return (
    <div className={"flex w-full flex-col gap-3 py-4"}>
      <div
        title={profile.ui_share_button}
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          {profile.ui_share_button}
        </h2>
        <ShareButton profile={profile} />
        <XShareButton profile={profile} />
      </div>
      <div
        title="이미지로 내보내기"
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          {profile.ui_export_button}
        </h2>
        <ExportProfileImageButton profile={profile} />
      </div>
    </div>
  );
}
