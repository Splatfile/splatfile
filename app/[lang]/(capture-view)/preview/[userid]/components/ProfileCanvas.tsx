"use client";
import { useEffect, useRef } from "react";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import Konva from "konva";
import useImage from "use-image";
import { Image as KonvaImage, Layer, Stage } from "react-konva";

import { GameInfoLayer } from "./GameInfoLayer";
import { PlateAndProfileImageLayer } from "./PlateAndProfileImageLayer";
import { UserInfoLayer } from "./UserInfoLayer";
import {
  useGameStore,
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";
import {
  canvasHeight,
  canvasWidth,
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

  const ProfileBackgroundImage = () => {
    const [image] = useImage("/background/body.png");
    const konvaImageRef = useRef<Konva.Image>(null);

    useEffect(() => {
      // 필터를 적용하기 위해서는, 이미지에 변화가 있을 때마다 매번 캐시를 업데이트 해주어야 한다.
      if (!konvaImageRef.current) return;
      konvaImageRef.current.cache();
    }, [image]);

    return (
      <KonvaImage
        ref={konvaImageRef}
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
        filters={[
          Konva.Filters.Blur,
          Konva.Filters.Contrast,
          Konva.Filters.Brighten,
        ]}
        blurRadius={2}
        contrast={0.7}
        brightness={-0.7}
      />
    );
  };

  const downloadCanvas = () => {
    const stage = stageRef.current;
    const link = downloadRef.current;
    if (!stage || !link) return;

    // Canvas 내용을 이미지로 변환
    // 다운로드 링크 설정
    link.download = "profile.png";
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
          <ProfileBackgroundImage />
        </Layer>
        <PlateAndProfileImageLayer
          tempCanvasRef={plateRef}
          tag={tag}
          profileImageUrl={profileImageUrl}
        />
        <UserInfoLayer userStore={userStore} />
        <GameInfoLayer gameStore={gameStore} />
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
