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
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { PlayTimeObject } from "@/app/lib/schemas/profile";
import { z } from "zod";
import {
  rankImageUrl,
  regularImageUrl,
  salmonImageUrl,
} from "@/app/lib/constants/image-urls";
import {
  salmonRunRanksKo,
  XMatchInfoObject,
} from "@/app/lib/schemas/profile/game-info";
import { chunkArrayInGroups } from "@/app/lib/utils/array";

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

const defaultFontSize = 34;
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

const getWeaponTitleText = (): TextRender => {
  const prevText = getWeekendTimeText();
  return {
    text: "사용 무기",
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding * 4,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};

const rightSideWidth = 280;
const getLevelTitleText = (): TextRender => {
  const prevText = getNameText("");

  return {
    text: "레벨",
    x: prevText.x + leftSideWidth + leftPadding,
    y: prevText.y,
    size: defaultFontSize + 2,
    maxWidth: rightSideWidth,
  };
};

const getRegularLevelText = async (
  ctx: CanvasRenderingContext2D,
  prevText: TextRender,
  text: string,
): Promise<TextRender> => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = new Image();
  levelImage.src = regularImageUrl;

  const imageX = prevText.x;
  const imageY = prevText.y + 28;

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

  const imageX = leftText.x + 56;
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

  const imageX = leftText.x + 56;
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

const matchPointRect = (
  ctx: CanvasRenderingContext2D,
  prevText: TextRender,
): MatchPointRect => {
  ctx.strokeStyle = "#f67018";
  ctx.lineWidth = 3;

  const x = prevText.x - 50;
  const y = prevText.y + defaultFontSize;

  // X 매치만 묵을 때 사용
  // const rectY = y;
  const rectY = 20;

  const width = canvasWidth - prevText.x + 30;
  const height = 160;

  // X 매치만 묵을 때 사용
  // const rectHeight = 160;
  const rectHeight = 300;

  const paddingX = 10;

  drawRoundedRect(
    ctx,
    x - paddingX,
    rectY,
    width + paddingX,
    rectHeight,
    12,
    "#bbbbbb",
    0.2,
  );

  return {
    x1: x,
    y1: y - 10,
    x2: x + width,
    y2: y + height - 20,
  };
};

type MatchPointRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const renderMatchPoint = (
  ctx: CanvasRenderingContext2D,
  rect: MatchPointRect,
  point: z.infer<typeof XMatchInfoObject>,
) => {
  if (!point) return;
  let { x1, y1, x2, y2 } = rect;

  ctx.font = `${defaultFontSize}px KERINm`;
  ctx.fillStyle = "#FFFFFF";

  const areaImage = new Image();
  areaImage.src = "/ingames/area.webp";

  const clamImage = new Image();
  clamImage.src = "/ingames/clam.webp";

  const fishImage = new Image();
  fishImage.src = "/ingames/fish.webp";

  const towerImage = new Image();
  towerImage.src = "/ingames/tower.webp";

  const paddingX = 10;
  const paddingY = 20;
  const imageSize = 42;

  const areaX = x1 + paddingX;
  const areaY = y1 + paddingY;

  const clamX = x1 + (x2 - x1) / 2 + paddingX;
  const clamY = areaY;

  const fishX = areaX;
  const fishY = y1 + (y2 - y1) - imageSize - paddingY;

  const towerX = clamX;
  const towerY = fishY;

  const { area, clam, fish, tower } = point;

  const textMargin = 10;
  const maxTextWidth = (x2 - x1) / 2 - (paddingX + imageSize + textMargin);

  renderText(ctx, {
    text: area || "",
    x: areaX + imageSize + textMargin,
    y: areaY + imageSize * 0.8,
    size: imageSize,
    maxWidth: maxTextWidth,
  });

  renderText(ctx, {
    text: clam || "",
    x: clamX + imageSize + textMargin,
    y: clamY + imageSize * 0.8,
    size: imageSize,
    maxWidth: maxTextWidth,
  });

  renderText(ctx, {
    text: fish || "",
    x: fishX + imageSize + textMargin,
    y: fishY + imageSize * 0.8,
    size: imageSize,
    maxWidth: maxTextWidth,
  });

  renderText(ctx, {
    text: tower || "",
    x: towerX + imageSize + textMargin,
    y: towerY + imageSize * 0.8,
    size: imageSize,
    maxWidth: maxTextWidth,
  });

  areaImage.onload = () => {
    ctx.drawImage(areaImage, areaX, areaY, imageSize, imageSize);
  };

  clamImage.onload = () => {
    ctx.drawImage(clamImage, clamX, clamY, imageSize, imageSize);
  };

  fishImage.onload = () => {
    ctx.drawImage(fishImage, fishX, fishY, imageSize, imageSize);
  };

  towerImage.onload = () => {
    ctx.drawImage(towerImage, towerX, towerY, imageSize, imageSize);
  };
};

const renderText = (ctx: CanvasRenderingContext2D, text: TextRender) => {
  ctx.font = `${text.size}px KERINm`;
  // ctx.font = `${text.size}px KCUBEr`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(text.text, text.x, text.y, text.maxWidth);
};

type ProfileCanvasRenderProps = {
  tag: ReturnType<typeof useTagStore.getState>;
  userStore: ReturnType<typeof useUserStore>;
  gameStore: ReturnType<typeof useGameStore>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor?: string,
  globalAlpha?: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  if (fillColor) {
    globalAlpha && (ctx.globalAlpha = globalAlpha);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.stroke();
}

const renderWeapons = async (
  ctx: CanvasRenderingContext2D,
  weapons: string[][],
  x: number,
  y: number,
) => {
  const weaponSize = 64;
  const weaponPadding = 10;

  for (let i = 0; i < weapons.length; i++) {
    const weaponRow = weapons[i];

    for (let j = 0; j < weaponRow.length; j++) {
      const weapon = weaponRow[j];
      const weaponImage = new Image();
      weaponImage.src = `/ingames/weapons/mains/${weapon}.webp`;

      const weaponX =
        x + j * (weaponSize + weaponPadding) + (i * weaponSize) / 2;
      const weaponY = y + i * (weaponSize + weaponPadding);

      ctx.strokeStyle = "#bfec4b";

      ctx.lineWidth = 2;
      drawRoundedRect(
        ctx,
        weaponX,
        weaponY,
        weaponSize,
        weaponSize,
        12,
        "#bbbbbb",
        0.5,
      );

      weaponImage.onload = () => {
        ctx.drawImage(weaponImage, weaponX, weaponY, weaponSize, weaponSize);
      };
    }
  }
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
