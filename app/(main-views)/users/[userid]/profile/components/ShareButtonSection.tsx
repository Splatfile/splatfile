import { ShareButton } from "@/app/ui/components/ShareButton";
import { XShareButton } from "@/app/ui/components/XShareButton";
import { ExportProfileImageButton } from "@/app/(main-views)/users/[userid]/profile/components/ExportProfileImageButton";
import React from "react";

type ShareButtonSectionProps = {};

export function ShareButtonSection(props: ShareButtonSectionProps) {
  return (
    <div className={"flex w-full flex-col gap-3 py-4"}>
      <div
        title={"공유하기"}
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>공유하기</h2>
        <ShareButton />
        <XShareButton />
      </div>
      <div
        title="이미지로 내보내기"
        className={
          "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-3 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md "
        }
      >
        <h2 className={"text-xl font-semibold text-neutral-700"}>
          이미지로 내보내기
        </h2>
        <ExportProfileImageButton />
      </div>
    </div>
  );
}
