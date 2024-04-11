import {
  rankImageUrl,
  regularImageUrl,
  salmonImageUrl,
} from "@/app/lib/constants/image-urls";
import { z } from "zod";
import { PlayTimeObject } from "@/app/lib/schemas/profile";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { XMatchInfoObject } from "@/app/lib/schemas/profile/game-info";

import {
  CanvasRenderingContext2D as NodeCanvasRenderingContext2D,
  loadImage,
} from "canvas";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export type X = number;

type Y = number;
type Width = number;
type Height = number;
type Rect = [X, Y, Width, Height];
const x = 0;
const y = 1;
const w = 2;
const h = 3;
export const canvasWidth = 1024;
export const canvasHeight = 536;
export const profileImageRect: Rect = [20, 20, 267, 400];
export const plateRect: Rect = [
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
export const getNameText = (text: string): TextRender => {
  return {
    text: "이름: " + text,
    x: profileImageRect[x] + profileImageRect[w] + leftPadding,
    y: profileImageRect[y] + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};
export const getFriendCodeText = (text: string): TextRender => {
  const prevText = getNameText("");
  return {
    text: "친구 코드: " + text,
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};
export const getPlaytimeTitleText = (): TextRender => {
  const prevText = getFriendCodeText("");
  return {
    text: "접속 시간",
    x: prevText.x,
    y: prevText.y + defaultFontSize + topPadding + 20,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
  };
};
export const getWeekdayText = (
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
export const getWeekendTimeText = (
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
export const getWeaponTitleText = (): TextRender => {
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
export const getLevelTitleText = (): TextRender => {
  const prevText = getNameText("");

  return {
    text: "레벨",
    x: prevText.x + leftSideWidth + leftPadding,
    y: prevText.y,
    size: defaultFontSize + 2,
    maxWidth: rightSideWidth,
  };
};
export const getRegularLevelText = async (
  ctx: NodeCanvasRenderingContext2D,
  prevText: TextRender,
  text: string,
): Promise<TextRender> => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = await loadImage(regularImageUrl);

  const imageX = prevText.x;
  const imageY = prevText.y + 28;

  ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);

  return {
    text,
    x: prevText.x + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};
export const renderRankLevelImageAngGetText = async (
  ctx: NodeCanvasRenderingContext2D,
  leftText: TextRender,
  text: string,
) => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = await loadImage(baseUrl + rankImageUrl);

  const imageX = leftText.x + 56;
  const imageY = leftText.y - defaultFontSize + 5;

  ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);

  return {
    text,
    x: imageX + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};
export const renderSalmonLevelImageAndGetText = async (
  ctx: NodeCanvasRenderingContext2D,
  leftText: TextRender,
  text: string,
) => {
  const imageWidth = defaultFontSize;
  const imageHeight = defaultFontSize;

  const levelImage = await loadImage(salmonImageUrl);

  const imageX = leftText.x + 56;
  const imageY = leftText.y - defaultFontSize + 6;

  ctx.drawImage(levelImage, imageX, imageY, imageWidth, imageHeight);

  return {
    text,
    x: imageX + imageWidth + 5,
    y: imageY + defaultFontSize * 0.8,
    size: defaultFontSize,
    maxWidth: rightSideWidth,
  };
};
export const matchPointRect = (
  ctx: NodeCanvasRenderingContext2D,
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
export const renderMatchPoint = async (
  ctx: NodeCanvasRenderingContext2D,
  rect: MatchPointRect,
  point: z.infer<typeof XMatchInfoObject>,
) => {
  if (!point) return;
  let { x1, y1, x2, y2 } = rect;

  ctx.font = `${defaultFontSize}px KERINm`;
  ctx.fillStyle = "#FFFFFF";

  const areaImage = await loadImage(baseUrl + "/ingames/area.png");

  const clamImage = await loadImage(baseUrl + "/ingames/clam.png");

  const fishImage = await loadImage(baseUrl + "/ingames/fish.png");

  const towerImage = await loadImage(baseUrl + "/ingames/tower.png");

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

  ctx.drawImage(areaImage, areaX, areaY, imageSize, imageSize);
  ctx.drawImage(clamImage, clamX, clamY, imageSize, imageSize);
  ctx.drawImage(fishImage, fishX, fishY, imageSize, imageSize);
  ctx.drawImage(towerImage, towerX, towerY, imageSize, imageSize);
};
export const renderText = (
  ctx: NodeCanvasRenderingContext2D,
  text: TextRender,
) => {
  ctx.font = `${text.size}px KERINm`;
  // ctx.font = `${text.size}px KCUBEr`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(text.text, text.x, text.y, text.maxWidth);
};

function drawRoundedRect(
  ctx: NodeCanvasRenderingContext2D,
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

export const renderWeapons = async (
  ctx: NodeCanvasRenderingContext2D,
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
      const weaponImage = await loadImage(
        baseUrl + `/ingames/weapons/mains/${weapon}.png`,
      );

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

      ctx.drawImage(weaponImage, weaponX, weaponY, weaponSize, weaponSize);
    }
  }
};

export function isPlateInfo(
  obj: unknown,
): obj is z.infer<typeof PlateInfoObject> {
  const parsed = PlateInfoObject.safeParse(obj);
  if (!parsed.success) {
    throw parsed.error;
  }
  return parsed.success;
}

export const PlateInfoObject = z.object({
  id: z.string(),
  name: z.string(),
  title: z.object({
    first: z.number(),
    last: z.number(),
    string: z.string(),
  }),
  banner: z.string(),
  badges: z.tuple([z.string(), z.string(), z.string()]),
  color: z.string(),
  bgColours: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  isCustom: z.boolean(),
  isGradient: z.boolean(),
  layers: z.number(),
  gradientDirection: z.enum([
    "to top",
    "to bottom",
    "to left",
    "to right",
    "to top left",
    "to top right",
    "to bottom left",
    "to bottom right",
    "to outside",
  ]),
});
