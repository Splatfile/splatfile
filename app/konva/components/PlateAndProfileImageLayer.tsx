"use client";
import { useProfileImageUrl } from "@/app/lib/hooks/use-profile-store";
import {
  plateRect,
  profileImageCornerRadius,
  profileImageRect,
} from "@/app/lib/utils/render-preview-canvas";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect } from "react-konva";
import useImage from "use-image";
import { useKonvaRenderStore } from "@/app/lib/hooks/use-konva-render-store";
import Konva from "konva";

type ProfileImageProps = {
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

function ProfileImage({ profileImageUrl }: ProfileImageProps) {
  const [image, status] = useImage(profileImageUrl ?? "", "anonymous");

  useEffect(() => {
    if (status !== "loaded") return;
    useKonvaRenderStore.getState().setLoadingTask("profileImage", true);
  }, [status]);

  return (
    <KonvaImage
      image={image}
      x={profileImageRect[0]}
      y={profileImageRect[1]}
      width={profileImageRect[2]}
      height={profileImageRect[3]}
      stroke="#737373"
      strokeWidth={4}
      cornerRadius={profileImageCornerRadius}
    />
  );
}

type PlateProps = {
  tag: ReturnType<typeof useTagStore.getState>;
};

function Plate({ tag }: PlateProps) {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  const [setLoadingTask] = useKonvaRenderStore((state) => [
    state.setLoadingTask,
  ]);
  const konvaImageRef = useRef<Konva.Image>(null);

  useEffect(() => {
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";

    imageObj.onload = () => {
      setImage(imageObj);
    };

    const interval = setInterval(async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 700;
      canvas.height = 200;

      const loaded = await loadFonts();
      await renderPlate(canvas, tag, tag.language ?? "USen");

      imageObj.src = canvas.toDataURL();

      if (loaded) clearInterval(interval);
    }, 1500);

    return () => clearInterval(interval);
  }, [tag]);

  useEffect(() => {
    if (!konvaImageRef.current) return;
    if (!image) return;

    setLoadingTask("plateRendering", true);
  }, [image, setLoadingTask]);

  return (
    <KonvaImage
      ref={konvaImageRef}
      image={image}
      x={plateRect[0]}
      y={plateRect[1]}
      width={plateRect[2]}
      height={plateRect[3]}
      strokeWidth={4}
    />
  );
}

type PlateAndProfileImageLayerProps = {
  tag: ReturnType<typeof useTagStore.getState>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

export function PlateAndProfileImageLayer({
  tag,
  profileImageUrl,
}: PlateAndProfileImageLayerProps) {
  return (
    <Layer>
      <Rect
        x={152}
        y={335}
        width={200}
        height={100}
        fill="#B17D7D"
        rotationDeg={10}
        cornerRadius={5}
      />
      <Rect
        x={140}
        y={320}
        width={200}
        height={100}
        fill="#B17D7D"
        rotationDeg={10}
        cornerRadius={5}
        stroke={"black"}
        strokeWidth={1}
      />
      <ProfileImage profileImageUrl={profileImageUrl} />
      <Plate tag={tag} />
    </Layer>
  );
}
