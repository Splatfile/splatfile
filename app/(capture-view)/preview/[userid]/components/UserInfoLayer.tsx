"use client";
import { Layer, Rect, Text } from "react-konva";

import { jua } from "@/app/fonts";
import {
  useUserStore
} from "@/app/lib/hooks/use-profile-store";

type UserInfoLayerProps = {
  userStore: ReturnType<typeof useUserStore>;
};

export function UserInfoLayer({ userStore }: UserInfoLayerProps) {
  const FONT_SIZE = 28; // tmp
  const FONT_FAMILY = jua.style.fontFamily;

  var playTimeText = null;
  if (userStore.weekdayPlaytime || userStore.weekendPlaytime) {
    playTimeText = "접속 시간대: ";
    if (userStore.weekdayPlaytime) {
      playTimeText += `(주중) ${userStore.weekdayPlaytime.start
        .toString()
        .padStart(2, "0")}:00-${userStore.weekdayPlaytime.end
          .toString()
          .padStart(2, "0")}:00 `;
    }
    if (userStore.weekendPlaytime) {
      playTimeText += `/ (주말) ${userStore.weekendPlaytime.start
        .toString()
        .padStart(2, "0")}:00-${userStore.weekendPlaytime.end
          .toString()
          .padStart(2, "0")}:00 `;
    }
  }

  return (
    <Layer>
      <Text
        x={358}
        y={50}
        text={`이름: ${userStore.switchInfo?.name || userStore.twitterInfo?.name || ""
          } `}
        fill="white"
        fontFamily={FONT_FAMILY}
        fontSize={FONT_SIZE}
      />
      {userStore.switchInfo?.friendCode && (
        <Text
          x={662}
          y={50}
          text={`친구코드: ${userStore.switchInfo.friendCode} `}
          fill="white"
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
        />
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
