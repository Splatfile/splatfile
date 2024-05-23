"use client";
import {
  useProfileImageUrl
} from "@/app/lib/hooks/use-profile-store";
import {
  plateRect,
  profileImageBorderRadius as profileImageCornerRadius,
  profileImageRect
} from "@/app/lib/utils/render-preview-canvas";
import { loadFonts, renderPlate } from "@/app/plate/lib/render-plate";
import { useTagStore } from "@/app/plate/lib/store/use-tag-store";
import {
  RefObject,
  useEffect,
  useState
} from "react";
import { Image as KonvaImage, Layer, Rect } from "react-konva";
import useImage from "use-image";

type ProfileImageProps = {
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

function ProfileImage({ profileImageUrl }: ProfileImageProps) {
  const [image] = useImage(profileImageUrl ?? "", "anonymous");

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
  tempCanvasRef: RefObject<HTMLCanvasElement>;
  tag: ReturnType<typeof useTagStore.getState>;
};

function Plate({ tempCanvasRef, tag }: PlateProps) {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";

    const interval = setInterval(async () => {
      if (!tempCanvasRef.current) return;
      const loaded = await loadFonts();
      await renderPlate(tempCanvasRef.current, tag);

      imageObj.src = tempCanvasRef.current.toDataURL();

      if (loaded) clearInterval(interval);
    }, 3000);

    imageObj.onload = () => {
      setImage(imageObj);
    };

    return () => clearInterval(interval);
  }, [tempCanvasRef, tag]);

  return (
    <KonvaImage
      image={image}
      x={plateRect[0]}
      y={plateRect[1]}
      width={plateRect[2]}
      height={plateRect[3]}
      strokeWidth={4}
      draggable={true}
    />
  );
}

type PlateAndProfileImageLayerProps = {
  tempCanvasRef: RefObject<HTMLCanvasElement>;
  tag: ReturnType<typeof useTagStore.getState>;
  profileImageUrl: ReturnType<typeof useProfileImageUrl>;
};

export function PlateAndProfileImageLayer({
  tempCanvasRef,
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
      <Plate tempCanvasRef={tempCanvasRef} tag={tag} />
    </Layer>
  );
}
