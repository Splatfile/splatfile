"use client";
import { useEffect, useRef } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import {
  useProfileImageUrl,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";

export function ProfileCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);
  const tag = useTagStore();
  const userStore = useUserStore();
  const profileImageUrl = useProfileImageUrl();

  const renderImage = () => {
    if (!profileImageUrl) return;
    const image = new Image();
    image.src = profileImageUrl;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(image, 20, 20, 267, 400);
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
    ctx.drawImage(plate, 20, 420, 267, 76);
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
      <canvas ref={canvasRef} width={1024} height={536}></canvas>
      <canvas
        className={"hidden"}
        ref={plateRef}
        width={700}
        height={200}
      ></canvas>
    </div>
  );
}
