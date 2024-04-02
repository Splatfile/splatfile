"use client";
import { useEffect, useRef } from "react";
import { renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";

export function ProfileCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tag = useTagStore();

  const renderImage = () => {
    const image = new Image();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderPlate(canvas, tag);
  }, [tag]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setTimeout(() => renderPlate(canvas, tag), 3000);
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={1024} height={536}></canvas>
    </div>
  );
}
