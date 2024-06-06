"use client";
import { jua } from "@/app/fonts";
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
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import Konva from "konva";
import { useEffect, useRef } from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { GameInfoLayer } from "./GameInfoLayer";
import { PlateAndProfileImageLayer } from "./PlateAndProfileImageLayer";
import { UserInfoLayer } from "./UserInfoLayer";

import { useKonvaRenderStore } from "@/app/lib/hooks/use-konva-render-store";
import { useLocale } from "@/app/lib/use-locale";

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

function ProfileBackgroundImage() {
  const [image, status] = useImage("/background/body.png");
  const konvaImageRef = useRef<Konva.Image>(null);
  const setLoadingTask = useKonvaRenderStore((state) => state.setLoadingTask);

  useEffect(() => {
    setLoadingTask("background", status === "loaded");
  }, [status, setLoadingTask]);

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
}

type ProfileCanvasProps = {
  onRenderComplete?: (resultDataUrl: string) => void;
  hidden?: boolean;
};

export function ProfileCanvas({
  onRenderComplete,
  hidden,
}: ProfileCanvasProps) {
  const tag = useTagStore();
  const gameStore = useGameStore();
  const userStore = useUserStore();
  const profileImageUrl = useProfileImageUrl();
  hidden = hidden || false;
  onRenderComplete = onRenderComplete || ((resultDataUrl) => {});

  return (
    <div className={hidden ? "hidden" : ""}>
      <ProfileCanvasRender
        tag={tag}
        gameStore={gameStore}
        userStore={userStore}
        profileImageUrl={profileImageUrl}
        onRenderComplete={onRenderComplete}
      />
    </div>
  );
}

type ProfileCanvasRenderProps = {
  tag: ReturnType<typeof useTagStore.getState>;
  userStore: ReturnType<typeof useUserStore>;
  gameStore: ReturnType<typeof useGameStore>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
  onRenderComplete: (resultDataUrl: string) => void;
};

export function ProfileCanvasRender({
  tag,
  userStore,
  gameStore,
  profileImageUrl,
  onRenderComplete,
}: ProfileCanvasRenderProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const locale = useLocale();
  const [getFullyLoaded, setLoadingTask] = useKonvaRenderStore((state) => [
    state.getFullyLoaded,
    state.setLoadingTask,
  ]);

  // 폰트 로딩 체크
  useEffect(() => {
    const timeout = setInterval(async () => {
      const fontLoaded = await loadFonts();
      if (fontLoaded && stageRef.current) {
        // 폰트 로딩 확인 후 다시 draw 요청
        stageRef.current.batchDraw();
        setLoadingTask("font", fontLoaded);

        clearInterval(timeout);
      }
    }, 500);

    return () => {
      clearInterval(timeout);
    };
  }, [setLoadingTask]);

  // 렌더링 완료 체크
  useEffect(() => {
    const timeout = setInterval(() => {
      if (!stageRef.current) {
        return;
      }

      if (getFullyLoaded()) {
        stageRef.current.batchDraw();

        setTimeout(() => {
          if (!stageRef.current) {
            return;
          }

          const dataUrl = stageRef.current.toDataURL();
          onRenderComplete(dataUrl);
        }, 500);

        clearInterval(timeout);
      }
    }, 200);

    return () => {
      clearInterval(timeout);
    };
  }, [getFullyLoaded, onRenderComplete]);

  return (
    <div className={"w-full"}>
      <Stage ref={stageRef} width={canvasWidth} height={canvasHeight}>
        <Layer>
          <ProfileBackgroundImage />
        </Layer>
        <PlateAndProfileImageLayer
          tag={tag}
          profileImageUrl={profileImageUrl}
        />
        <UserInfoLayer locale={locale} userStore={userStore} />
        <GameInfoLayer locale={locale} gameStore={gameStore} />
      </Stage>
    </div>
  );
}
