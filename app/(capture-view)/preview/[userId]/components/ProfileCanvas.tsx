"use client";
import { useEffect, useRef } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import {
  useGameStore,
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { PlayTimeObject } from "@/app/lib/schemas/profile";
import { z } from "zod";
import {
  rankImageUrl,
  regularImageUrl,
  salmonImageUrl,
} from "@/app/lib/constants/image-urls";
import { salmonRunRanksKo } from "@/app/lib/schemas/profile/game-info";

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

type X = number;
type Y = number;
type Width = number;
type Height = number;

type Rect = [X, Y, Width, Height];
const x = 0;
const y = 1;
const w = 2;
const h = 3;

const canvasWidth = 1024;
const canvasHeight = 536;

const profileImageRect: Rect = [20, 20, 267, 400];

const plateRect: Rect = [
  profileImageRect[x],
  profileImageRect[y] + profileImageRect[h],
  profileImageRect[w],
  200 * (profileImageRect[w] / 700),
];

type TextRender = {
  text: string;
  x: number;
  y: number;
  size: number;
  maxWidth: number;
};

const defaultFontSize = 28;
const leftPadding = 20;
const leftSideWidth = 350;
const topPadding = 10;
const getNameText = (text: string): TextRender => {
  return {
    text: "이름: " + text,
    x: profileImageRect[x] + profileImageRect[w] + leftPadding,
    y: profileImageRect[y] + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};

const getFriendCodeText = (text: string): TextRender => {
  const prevText = getNameText("");
  return {
    text: "친구 코드: " + text,
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};

const getPlaytimeTitleText = (): TextRender => {
  const prevText = getFriendCodeText("");
  return {
    text: "접속 시간",
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding + 20,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};

const getWeekdayText = (
  playtime?: z.infer<typeof PlayTimeObject>,
): TextRender => {
  const prevText = getPlaytimeTitleText();

  const start = new Date(2020, 0, 1, playtime?.start ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedStart = format(start, "a h시", { locale: ko });

  const end = new Date(2020, 0, 1, playtime?.end ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedEnd = format(end, "a h시", { locale: ko });
  return {
    text: "평일: " + formattedStart + " ~ " + formattedEnd,
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};

const getWeekendTimeText = (
  playtime?: z.infer<typeof PlayTimeObject>,
): TextRender => {
  const prevText = getWeekdayText();

  const start = new Date(2020, 0, 1, playtime?.start ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedStart = format(start, "a h시", { locale: ko });

  const end = new Date(2020, 0, 1, playtime?.end ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedEnd = format(end, "a h시", { locale: ko });
  return {
    text: "주말: " + formattedStart + " ~ " + formattedEnd,
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};
const rightSideWidth = 280;
const getLevelTitleText = (): TextRender => {
  const prevText = getNameText("");

  return {
    text: "레벨",
    x: prevText.x + leftSideWidth,
    y: prevText.y,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};

const getRegularLevelText = async (
  ctx: CanvasRenderingContext2D,
  text: string,
): Promise<TextRender> => {
  const prevText = getLevelTitleText();
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = new Image();
  levelImage.src = regularImageUrl;

  const imageX = prevText.x;
  const imageY = prevText.y + 12;

  levelImage.onload = () => {
    ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);
  };

  return {
    text,
    x: prevText.x + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};

const renderRankLevelImageAngGetText = async (
  ctx: CanvasRenderingContext2D,
  leftText: TextRender,
  text: string,
) => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = new Image();
  levelImage.src = rankImageUrl;

  const imageX = leftText.x + 36;
  const imageY = leftText.y - defaultFontSize + 5;

  levelImage.onload = () => {
    ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);
  };

  return {
    text,
    x: imageX + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};

const renderSalmonLevelImageAndGetText = async (
  ctx: CanvasRenderingContext2D,
  leftText: TextRender,
  text: string,
) => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = new Image();
  levelImage.src = salmonImageUrl;

  const imageX = leftText.x + 36;
  const imageY = leftText.y - defaultFontSize + 6;

  levelImage.onload = () => {
    ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);
  };

  return {
    text,
    x: imageX + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};

const renderText = (ctx: CanvasRenderingContext2D, text: TextRender) => {
  ctx.font = `${text.size}px KERINm`;
  // ctx.font = `${text.size}px KCUBEr`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(text.text, text.x, text.y, text.maxWidth);
};

const endOfTextX = (text: TextRender) => text.x + text.maxWidth;

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

  const renderImage = () => {
    if (!profileImageUrl) return;
    const image = new Image();

    image.src = profileImageUrl;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, ...profileImageRect);
    };
  };

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!canvas || !plate) return;
    await renderPlate(plate, tag);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Background
    ctx.fillStyle = "#bbbbbb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Profile Image
    renderImage();
    ctx.drawImage(plate, ...plateRect);

    // Left Text Side
    renderText(
      ctx,
      getNameText(
        userStore.switchInfo?.name || userStore.twitterInfo?.name || "",
      ),
    );
    renderText(ctx, getFriendCodeText(userStore.switchInfo?.friendCode || ""));
    renderText(ctx, getPlaytimeTitleText());
    renderText(ctx, getWeekdayText(userStore.weekdayPlaytime));
    renderText(ctx, getWeekendTimeText(userStore.weekendPlaytime));

    // Right Text Side
    renderText(ctx, getLevelTitleText());

    const regularLevelText = await getRegularLevelText(
      ctx,
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

    // Preview

    setTimeout(() => {
      twitterPreviewRef.current
        ?.getContext("2d")
        ?.drawImage(canvas, 0, 0, canvasWidth / 2, canvasHeight / 2);
    }, 500);
  };

  useEffect(() => {
    const plate = plateRef.current;
    const canvas = canvasRef.current;
    if (!plate || !canvas) return;
    renderCanvas();
  }, [tag, userStore]);

  useEffect(() => {
    const plate = plateRef.current;

    if (!plate) return;

    const interval = setInterval(async () => {
      const loaded = await loadFonts();
      await renderPlate(plate, tag);
      await renderCanvas();
      if (loaded) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [userStore]);

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
    <div>
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
