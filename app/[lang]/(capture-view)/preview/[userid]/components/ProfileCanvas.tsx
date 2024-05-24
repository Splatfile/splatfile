"use client";
import { useEffect, useRef, useState } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import Konva from "konva";
import useImage from "use-image";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";

import {
  useGameStore,
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";
import {
  canvasHeight,
  canvasWidth,
  plateRect,
  profileImageBorderRadius as profileImageCornerRadius,
  profileImageRect,
} from "@/app/lib/utils/render-preview-canvas";

export function ProfileCanvas() {
  const tag = useTagStore();
  const gameStore = useGameStore();
  const userStore = useUserStore();
  const profileImageUrl = useProfileImageUrl();
  return (
    <div>
      <ProfileCanvasRender
        tag={tag}
        gameStore={gameStore}
        userStore={userStore}
        profileImageUrl={profileImageUrl}
      />
    </div>
  );
}

type ProfileCanvasRenderProps = {
  tag: ReturnType<typeof useTagStore.getState>;
  userStore: ReturnType<typeof useUserStore>;
  gameStore: ReturnType<typeof useGameStore>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

export function ProfileCanvasRender({
  tag,
  userStore,
  gameStore,
  profileImageUrl,
}: ProfileCanvasRenderProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const BackgroundImage = () => {
    const [image] = useImage("/background/body.png");

    return (
      <KonvaImage
        image={image}
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
        crop={
          image && {
            x: 0,
            y: 0,
            width: image.width,
            height: image.width * (canvasHeight / canvasWidth),
          }
        }
        filters={[Konva.Filters.Blur, Konva.Filters.Brighten]}
        blurRadius={2}
        brightness={-0.7}
      />
    );
  };

  const ProfileImage = () => {
    const [image] = useImage(profileImageUrl ?? "", "anonymous");

    return (
      <KonvaImage
        image={image}
        x={profileImageRect[0]}
        y={profileImageRect[1]}
        width={profileImageRect[2]}
        height={profileImageRect[3]}
        stroke="white"
        strokeWidth={4}
        cornerRadius={profileImageCornerRadius}
      />
    );
  };

  const Plate = () => {
    const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

    useEffect(() => {
      const imageObj = new Image();
      imageObj.crossOrigin = "anonymous";

      const interval = setInterval(async () => {
        if (!plateRef.current) return;
        const loaded = await loadFonts();
        await renderPlate(plateRef.current, tag);

        imageObj.src = plateRef.current.toDataURL();

        if (loaded) clearInterval(interval);
      }, 3000);

      imageObj.onload = () => {
        setImage(imageObj);
      };

      return () => clearInterval(interval);
    }, [tag]);

    return (
      <KonvaImage
        image={image}
        x={plateRect[0]}
        y={plateRect[1]}
        width={plateRect[2]}
        height={plateRect[3]}
        stroke={"white"}
        strokeWidth={4}
      />
    );
  };

  const UserInfo = () => {
    const FONT_SIZE = 24; // tmp
    const FONT_FAMILY = "Splat-text";
    return (
      <>
        <Text
          x={358}
          y={50}
          text={`이름: ${userStore.switchInfo?.name || userStore.twitterInfo?.name || ""}`}
          fill="white"
          fontFamily={FONT_FAMILY}
          fontSize={FONT_SIZE}
        />
        {userStore.switchInfo?.friendCode && (
          <Text
            x={662}
            y={50}
            text={`친구코드: ${userStore.switchInfo.friendCode}`}
            fill="white"
            fontFamily={FONT_FAMILY}
            fontSize={FONT_SIZE}
          />
        )}

        <Rect
          x={385}
          y={335}
          width={615}
          height={150}
          cornerRadius={12}
          fill="#737373"
          opacity={0.9}
        />

        <Text
          x={400}
          y={353}
          width={585}
          height={120}
          text={userStore.introductionMessage || ""}
          fill="white"
          fontFamily={FONT_FAMILY}
          fontSize={20}
        />
      </>
    );
  };

  const GameInfo = () => {
    return (
      <>
        <Rect
          x={358}
          y={160}
          width={620}
          height={90}
          cornerRadius={12}
          fill="#737373"
          opacity={0.9}
        />
      </>
    );
  };

  const downloadCanvas = () => {
    const stage = stageRef.current;
    const link = downloadRef.current;
    if (!stage || !link) return;

    // Canvas 내용을 이미지로 변환
    // 다운로드 링크 설정

    link.href = stage.toDataURL({ mimeType: "image/png" });
    link.click();
  };

  return (
    <div className={"p-12 text-white"}>
      <p>저장용 이미지</p>
      <canvas
        ref={plateRef}
        width={700}
        height={200}
        className={"hidden"}
      ></canvas>
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight}>
        <Layer>
          <BackgroundImage />
        </Layer>
        <Layer>
          <ProfileImage />
          <Plate />
        </Layer>
        <Layer>
          <UserInfo />
          <GameInfo />
        </Layer>
      </Stage>

      <div>
        <a
          ref={downloadRef}
          className={"cursor-pointer p-4 text-white"}
          onClick={downloadCanvas}
        >
          다운로드
        </a>
      </div>
    </div>
  );
}
