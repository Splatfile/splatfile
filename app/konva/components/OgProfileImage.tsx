"use client";
import { useEffect } from "react";
import { renderOgProfileImage } from "@/app/konva/lib/render/og";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";
import { useLocale } from "@/app/lib/use-locale";

type OgProfileImageProps = {
  userInfo: UserInfo;
  gameInfo: GameInfo;
  plateInfo: PlateInfo;
};

export function OgProfileImage({ userInfo, gameInfo, plateInfo }: OgProfileImageProps) {
  const locale = useLocale();

  useEffect(() => {
    renderOgProfileImage(
      "og-profile-image-canvas",
      userInfo,
      gameInfo,
      plateInfo,
      locale
    );
  }, [locale]);

  return <div id="og-profile-image-canvas"></div>;
}
