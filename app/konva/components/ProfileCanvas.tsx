"use client";

import { useEffect, useRef, useState } from "react";
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
import {
  isFontLoaded,
  loadFonts as loadFontsForPlate,
} from "@/app/plate/lib/render-plate";
import { jua } from "@/app/fonts";

async function loadFonts() {
  var loaded = await loadFontsForPlate();

  for (const font of jua.style.fontFamily.split(", ")) {
    if (!(await isFontLoaded(font))) {
      loaded = false;
      break;
    }
  }

  return loaded;
}

type ProfileCanvasProps = {
  dataUrlCallback?: (dataUrl: string) => void;
  isLoading?: boolean;
};

export function ProfileCanvas({
  dataUrlCallback,
  isLoading,
}: ProfileCanvasProps) {
  const tag = useTagStore();
  const gameStore = useGameStore();
  const userStore = useUserStore();
  const profileImageUrl = useProfileImageUrl();
  dataUrlCallback = dataUrlCallback || ((dataUrl) => {});
  isLoading = isLoading || false;

  return (
    <div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="z-10 h-16 w-16 animate-spin rounded-full border-t-8 border-white"></div>
        </div>
      )}
      <div className={isLoading ? "blur-sm" : ""}>
        <ProfileCanvasRender
          tag={tag}
          gameStore={gameStore}
          userStore={userStore}
          profileImageUrl={profileImageUrl}
          dataUrlCallback={dataUrlCallback}
        />
      </div>
    </div>
  );
}

type ProfileCanvasRenderProps = {
  tag: ReturnType<typeof useTagStore.getState>;
  userStore: ReturnType<typeof useUserStore>;
  gameStore: ReturnType<typeof useGameStore>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
  dataUrlCallback: (dataUrl: string) => void;
};

export function ProfileCanvasRender({
  tag,
  userStore,
  gameStore,
  profileImageUrl,
  dataUrlCallback,
}: ProfileCanvasRenderProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

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

  useEffect(() => {
    const timeout = setInterval(async () => {
      const fontLoaded = await loadFonts();
      setFontLoaded(fontLoaded);

      if (fontLoaded) {
        clearInterval(timeout);
      }
    }, 1500);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;
    if (!fontLoaded) return;

    // 폰트 로딩 확인 후 다시 render
    stageRef.current.batchDraw();
    dataUrlCallback(stageRef.current.toDataURL({ mimeType: "image/png" }));
  }, [fontLoaded, dataUrlCallback]);

  return (
    <div className={"w-full"}>
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
    </div>
  );
}
