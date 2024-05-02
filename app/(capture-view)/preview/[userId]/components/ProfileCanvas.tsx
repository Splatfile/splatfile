"use client";
import { useCallback, useEffect, useRef } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import QRCode from "qrcode";

import {
  useGameStore,
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";
import { salmonRunRanksKo } from "@/app/lib/schemas/profile/game-info";
import { chunkArrayInGroups } from "@/app/lib/utils/array";
import {
  canvasHeight,
  canvasWidth,
  getFriendCodeText,
  getLevelTitleText,
  getNameText,
  getPlaytimeTitleText,
  getRegularLevelText,
  getWeaponTitleText,
  getWeekdayText,
  getWeekendTimeText,
  matchPointRect,
  plateRect,
  profileImageRect,
  renderMatchPoint,
  renderRankLevelImageAngGetText,
  renderSalmonLevelImageAndGetText,
  renderText,
  renderWeapons,
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const twitterPreviewRef = useRef<HTMLCanvasElement>(null);

  const renderImage = useCallback(() => {
    if (!profileImageUrl) return;
    const image = new Image();

    // 이미지 CORS를 활성화 함
    // CORS 허용된 이미지만 사용하도록 제한하는 대신,
    // canvas 다운로드 시 insecure에러가 발생하지 않음
    image.crossOrigin = "anonymous";
    image.src = profileImageUrl;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, ...profileImageRect);
    };
  }, [profileImageUrl]);

  const renderBackground = () => {
    return new Promise<void>((resolve) => {
      const image = new Image();
      image.src = "/background/body.png";
      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve();
      };
    });
  };

  const renderCanvas = useCallback(
    async (
      tag: ReturnType<typeof useTagStore.getState>,
      userStore: ReturnType<typeof useUserStore>,
      gameStore: ReturnType<typeof useGameStore>,
    ) => {
      const canvas = canvasRef.current;
      const plate = plateRef.current;
      if (!canvas || !plate) return;
      await renderPlate(plate, tag);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // Background
      await renderBackground();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#222222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Profile Image
      renderImage();
      ctx.drawImage(plate, ...plateRect);

      // Left Text Side
      const nameText = getNameText(
        userStore.switchInfo?.name || userStore.twitterInfo?.name || "",
      );
      const weekendText = getWeekendTimeText(userStore.weekendPlaytime);

      // Left Text Side Rect
      ctx.strokeStyle = "#dddddd";
      ctx.lineWidth = 3;

      // const y = nameText.y - topPadding / 2 - topPadding - defaultFontSize;
      // drawRoundedRect(
      //   ctx,
      //   nameText.x - leftPadding / 2,
      //   y,
      //   leftSideWidth,
      //   weekendText.y - y + defaultFontSize,
      //   12,
      //   "#bbbbbb",
      //   0.5,
      // );

      // Left Text Side Render
      renderText(ctx, nameText);
      renderText(
        ctx,
        getFriendCodeText(userStore.switchInfo?.friendCode || ""),
      );
      renderText(ctx, getPlaytimeTitleText());
      renderText(ctx, getWeekdayText(userStore.weekdayPlaytime));

      renderText(ctx, weekendText);

      const weaponTitleText = getWeaponTitleText();
      renderText(ctx, weaponTitleText);

      const weaponKeys = Object.keys(gameStore.weaponGearInfo ?? {}).filter(
        (w) => gameStore.weaponGearInfo?.[w]?.isActivated,
      );

      const filteredWeapons = chunkArrayInGroups(
        weaponKeys,
        Math.floor(weaponKeys.length / 2),
      );

      await renderWeapons(
        ctx,
        filteredWeapons,
        getWeaponTitleText().x,
        getWeaponTitleText().y + 20,
      );

      // Right Text Side

      const levelTitleText = getLevelTitleText();
      renderText(ctx, levelTitleText);
      // renderText(ctx, levelTitleText);

      const regularLevelText = await getRegularLevelText(
        ctx,
        levelTitleText,
        `${gameStore?.level || ""}`,
      );
      renderText(ctx, regularLevelText);

      const rankLevelText = await renderRankLevelImageAngGetText(
        ctx,
        regularLevelText,
        `${gameStore?.anarchyBattleRank?.grade || ""}`,
      );
      renderText(ctx, rankLevelText);

      const salmonGrade = gameStore?.salmonRunRank?.grade;
      const salmonLevelText = await renderSalmonLevelImageAndGetText(
        ctx,
        rankLevelText,
        `${salmonGrade ? salmonRunRanksKo[salmonGrade] : ""}`,
      );
      renderText(ctx, salmonLevelText);

      if (gameStore.anarchyBattleRank?.grade === "S+") {
        const rect = matchPointRect(ctx, regularLevelText);
        renderMatchPoint(ctx, rect, gameStore.xMatchInfo);
      }
      const qrUrlRegex =
        "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";
      if (
        userStore.switchInfo?.friendLink &&
        userStore.switchInfo.friendLink.match(qrUrlRegex)
      ) {
        const qrCode = await QRCode.toCanvas(userStore.switchInfo.friendLink, {
          margin: 1,
          color: { light: "#dddddd" },
        });

        const size = 180;

        ctx.drawImage(
          qrCode,
          canvasWidth - size,
          canvasHeight - size,
          size,
          size,
        );
      }

      // Preview
      setTimeout(() => {
        twitterPreviewRef.current
          ?.getContext("2d")
          ?.drawImage(canvas, 0, 0, canvasWidth / 2, canvasHeight / 2);
      }, 500);
    },
    [renderImage],
  );
  useEffect(() => {
    const plate = plateRef.current;
    const canvas = canvasRef.current;
    if (!plate || !canvas) return;
    renderCanvas(tag, userStore, gameStore).then();
  }, [gameStore, renderCanvas, tag, userStore]);

  useEffect(() => {
    const plate = plateRef.current;

    if (!plate) return;

    const interval = setInterval(async () => {
      const loaded = await loadFonts();
      await renderPlate(plate, tag);
      await renderCanvas(tag, userStore, gameStore);
      if (loaded) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [gameStore, renderCanvas, tag, userStore]);

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = downloadRef.current;
    if (!canvas || !link) return;

    // Canvas 내용을 이미지로 변환
    // 다운로드 링크 설정

    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className={"p-12 text-white"}>
      <p>서버 저장용 이미지 </p>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
      <canvas
        className={"hidden"}
        ref={plateRef}
        width={700}
        height={200}
      ></canvas>

      <div className={"p-8"}>
        <p>트위터에서 실제 보여질 사이즈</p>
        <canvas
          ref={twitterPreviewRef}
          width={canvasWidth / 2}
          height={canvasHeight / 2}
        ></canvas>
      </div>
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

