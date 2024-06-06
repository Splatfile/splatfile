"use client";
import { Layer, Rect, Text } from "react-konva";

import { jua } from "@/app/fonts";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import { Locale } from "@/app/lib/locales/locale";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";

type UserInfoLayerProps = {
  locale: Locale;
  userStore: ReturnType<typeof useUserStore>;
};

type textWidth = {
  name: number;
};

export function UserInfoLayer({ userStore, locale }: UserInfoLayerProps) {
  const FONT_SIZE = 28; // tmp
  const FONT_FAMILY = jua.style.fontFamily;

  var playTimeText = null;
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const nameText = `${locale.preview.nickname}: ${
    userStore.switchInfo?.name || userStore.twitterInfo?.name || ""
  }`;
  const [width, setWidth] = useState<textWidth>({
    name: 0,
  });
  const friendCodeTitleRef = useRef<Konva.Text>(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
    const nameWidth = ctx.measureText(nameText);

    setWidth({
      name: nameWidth.width,
    });
  }, [
    FONT_FAMILY,
    locale.preview.friend_code,
    nameText,
    userStore.switchInfo?.friendCode,
  ]);

  if (userStore.weekdayPlaytime || userStore.weekendPlaytime) {
    playTimeText = locale.preview.playtime_title + ": ";
    if (userStore.weekdayPlaytime) {
      playTimeText += `(${locale.preview.playtime_weekday}) ${userStore.weekdayPlaytime.start
        .toString()
        .padStart(2, "0")}~${userStore.weekdayPlaytime.end
        .toString()
        .padStart(2, "0")} `;
    }
    if (userStore.weekendPlaytime) {
      playTimeText += `/ (${locale.preview.playtime_weekend}) ${userStore.weekendPlaytime.start
        .toString()
        .padStart(2, "0")}~${userStore.weekendPlaytime.end
        .toString()
        .padStart(2, "0")} `;
    }
  }
  return (
    <Layer>
      <Text
        x={358}
        y={30}
        width={280}
        height={FONT_SIZE * 2}
        text={nameText}
        fill="white"
        align={"left"}
        verticalAlign={"middle"}
        fontFamily={FONT_FAMILY}
        fontSize={FONT_SIZE}
        ellipsis={true}
        wrap="none"
      />
      {userStore.switchInfo?.friendCode && (
        <>
          <Text
            ref={friendCodeTitleRef}
            x={358 + width.name + 30}
            y={30}
            height={FONT_SIZE * 2}
            width={130}
            text={`${locale.preview.friend_code}:`}
            align={"left"}
            verticalAlign={"middle"}
            fill="white"
            fontFamily={FONT_FAMILY}
            fontSize={FONT_SIZE}
          />
          <Text
            x={
              358 +
              width.name +
              30 +
              ((friendCodeTitleRef.current?.getTextWidth() ?? 130) > 130
                ? 110
                : friendCodeTitleRef.current?.getTextWidth() ?? 130) +
              10
            }
            y={30}
            height={FONT_SIZE * 2}
            text={`${userStore.switchInfo.friendCode} `}
            fill="white"
            align={"left"}
            verticalAlign={"middle"}
            fontFamily={FONT_FAMILY}
            fontSize={FONT_SIZE}
          />
        </>
      )}
      {playTimeText && (
        <Text
          x={358}
          y={100}
          text={playTimeText}
          fill="white"
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
        />
      )}
      <Rect
        x={385}
        y={325}
        width={610}
        height={160}
        cornerRadius={12}
        fill="#737373"
        opacity={0.9}
      />

      <Text
        x={400}
        y={343}
        width={580}
        height={135}
        text={userStore.introductionMessage || ""}
        fill="white"
        fontFamily={FONT_FAMILY}
        fontSize={20}
        ellipsis={true}
      />
    </Layer>
  );
}
