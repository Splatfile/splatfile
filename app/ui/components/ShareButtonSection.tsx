import { ShareButton } from "@/app/ui/components/ShareButton";
import { XShareButton } from "@/app/ui/components/XShareButton";
import React from "react";
import { Profile } from "@/app/lib/locales/locale";

type ShareButtonSectionProps = {
  profile: Profile;
};

export function ShareButtonSection(props: ShareButtonSectionProps) {
  const { profile } = props;
  return (
    <div className={"w-full py-4"}>
      <div
        title={profile.ui_share_button}
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          {profile.ui_share_button}
        </h2>
        <ShareButton />
        <XShareButton />
      </div>
    </div>
  );
}
