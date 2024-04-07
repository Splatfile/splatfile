"use client";
import { useEffect, useRef } from "react";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";

export function ProfileCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateRef = useRef<HTMLCanvasElement>(null);
  const tag = useTagStore();
  const userStore = useUserStore();

  const renderImage = () => {
    const image = new Image();
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!canvas || !plate) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(plate, 0, 0, 350, 100);
  };

  useEffect(() => {
    const plate = plateRef.current;
    const canvas = canvasRef.current;
    if (!plate || !canvas) return;
    renderPlate(plate, tag);
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
