import { jua } from "@/app/fonts";
import { loadFont } from "@/app/konva/lib/loading-utils";
import Konva from "konva";

type TextContainerProps = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  wrap?: "none" | "word" | "char";
  ellipsis?: boolean;
};

export async function newTextContainer(props: TextContainerProps) {
  props = {
    fontSize: 24,
    fontFamily: jua.style.fontFamily,
    fill: "white",
    wrap: "none",
    ...props,
  };

  await loadFont(props.fontSize!, props.fontFamily!, props.text);

  return new Konva.Text(props);
}

type BoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  cornerRadius?: number;
  opacity?: number;
};

export async function newBox(props: BoxProps) {
  props = {
    fill: "#737373",
    cornerRadius: 8,
    opacity: 0.9,
    ...props,
  };

  return new Konva.Rect(props);
}

type ImageContainerProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export async function newImageContainer(props: ImageContainerProps) {
  const konvaImage = new Konva.Image(props);
  konvaImage.cache();

  return konvaImage;
}
