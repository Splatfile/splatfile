"use client";

import { useEffect, useRef } from "react";

type RenderTestProps = {};

export function RenderTest(props: RenderTestProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = "/ingames/weapons/subs/PoisonMist.webp";

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    image.onload = () => {
      ctx.drawImage(image, 0, 0, 40, 40);
      const imageData = ctx.getImageData(0, 0, 40, 40);
      const pixels = imageData.data;

      for (var i = 0; i < pixels.length; i += 4) {
        // 검정색 픽셀을 찾습니다.
        if (
          pixels[i] === 0 &&
          pixels[i + 1] === 0 &&
          pixels[i + 2] === 0 &&
          pixels[i + 3] === 255
        ) {
          // 여기에서 마스크를 적용합니다. 예를 들어, 색상을 변경합니다.
          // 이 예에서는 R 값만 변경하여 색상을 변경합니다.
          pixels[i] = 255; // R 값을 빨간색으로 변경
          // Alpha 값을 조절하여 픽셀의 투명도를 조정할 수 있습니다.
          pixels[i + 3] = 255; // Alpha 값을 50%로 조정 (0 완전 투명, 255 완전 불투명)
        } else if (
          pixels[i] === 255 &&
          pixels[i + 1] === 255 &&
          pixels[i + 2] === 255 &&
          pixels[i + 3] === 255
        ) {
          pixels[i] = 0;
          pixels[i + 1] = 0;
          pixels[i + 2] = 0;
          pixels[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };

    return () => {
      ctx.clearRect(0, 0, 40, 40);
    };
    canvasRef.current;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={40}
      height={40}
      className={"h-full w-full"}
    ></canvas>
  );
}
