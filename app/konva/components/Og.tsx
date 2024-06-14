"use client";
import { useEffect } from "react";
import { renderOgProfileImage } from "@/app/konva/lib/render/og";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";

type OgProps = {
  userInfo: UserInfo;
  gameInfo: GameInfo;
  plateInfo: PlateInfo;
};

export function Og({ userInfo, gameInfo, plateInfo }: OgProps) {
  useEffect(() => {
    renderOgProfileImage(
      "og-profile-image-canvas",
      userInfo,
      gameInfo,
      plateInfo,
    );
  }, []);

  return <div id="og-profile-image-canvas"></div>;
}
