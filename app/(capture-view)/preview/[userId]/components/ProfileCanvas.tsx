"use client";
import { useEffect, useRef } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import {
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";

export function ProfileCanvas() {
  const tag = useTagStore();
  const userStore = useUserStore();
  const profileImageUrl = useProfileImageUrl();
  return (
    <ProfileCanvasRender
      tag={tag}
      userStore={userStore}
      profileImageUrl={profileImageUrl}
    />
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
const topPadding = 20;
const getNameText = (text: string): TextRender => {
  return {
    text: "이름: " + text,
    x: profileImageRect[x] + profileImageRect[w] + leftPadding,
    y: profileImageRect[y] + defaultFontSize,
    size: defaultFontSize,
    maxWidth: leftSideWidth,
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
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

export function ProfileCanvasRender({
  tag,
  userStore,
  profileImageUrl,
}: ProfileCanvasRenderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);

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

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!canvas || !plate) return;
    renderPlate(plate, tag);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#bbbbbb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderImage();
    ctx.drawImage(plate, ...plateRect);
    renderText(
      ctx,
      getNameText(
        userStore.switchInfo?.name || userStore.twitterInfo?.name || "",
      ),
    );
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
      renderCanvas();
      if (loaded) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [userStore]);

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
    </div>
  );
}
