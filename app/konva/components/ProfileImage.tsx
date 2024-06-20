"use client";
import { useEffect } from "react";
import { renderProfileImage } from "@/app/konva/lib/render/for-exporting";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";
import { Locale } from "@/app/lib/locales/locale";
import { useLocale } from "@/app/lib/use-locale";

type ProfileImageProps = {
  userInfo: UserInfo;
  gameInfo: GameInfo;
  plateInfo: PlateInfo;
  onRenderComplete?: (dataUrl: string) => void;
  hidden?: boolean;
  locale?: Locale;
};

export function ProfileImage({
  userInfo,
  gameInfo,
  plateInfo,
  onRenderComplete,
  hidden,
  locale,
}: ProfileImageProps) {
  const tempLocale = useLocale();
  onRenderComplete = onRenderComplete || (() => {});

  useEffect(() => {
    renderProfileImage(
      "profile-image-canvas",
      userInfo,
      gameInfo,
      plateInfo,
      locale || tempLocale,
    ).then((dataUrl) => onRenderComplete(dataUrl));
  }, [onRenderComplete, locale]);

  return (
    <div id="profile-image-canvas" className={hidden ? "hidden" : ""}></div>
  );
}
