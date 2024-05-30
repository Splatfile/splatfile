import Konva from "konva";
import { createCanvas, loadImage, registerFont } from "canvas";
import { baseUrl } from "@/app/plate/lib/const";
import { PlateInfo, UserInfo, GameInfo } from "@/app/lib/types/type-checker";
import { renderServerPlate } from "@/app/lib/utils/server-render-plate";
import { join } from "path";

async function initRendering() {
  const rootPath =
    process.env.NODE_ENV === "production"
      ? process.cwd() + "/.next/server/chunks/"
      : "public/assets";

  // load fonts
  registerFont(join(rootPath, "/fonts/KRko/BMJUA_otf.otf"), {
    family: "Jua",
  });

  registerFont(join(rootPath, "/fonts/SplatoonTitle.otf"), {
    family: "Splat-title",
    style: "normal",
    weight: "normal",
  });

  registerFont(join(rootPath, "/fonts/SplatoonText.otf"), {
    family: "Splat-text",
    style: "normal",
    weight: "normal",
  });
}

async function backgroundImage() {
  const image = await loadImage(baseUrl + "/background/body.png");

  const konvaImage = new Konva.Image({
    x: 0,
    y: 0,
    width: 600,
    height: 315,
    // @ts-ignore
    image: image,
    crop: {
      x: 0,
      y: 0,
      width: image.width,
      height: image.width * (315 / 600),
    },
  });
  konvaImage.cache();

  konvaImage.filters([
    Konva.Filters.Blur,
    Konva.Filters.Contrast,
    Konva.Filters.Brighten,
  ]);
  konvaImage.blurRadius(2);
  konvaImage.contrast(0.7);
  konvaImage.brightness(-0.7);

  return konvaImage;
}

async function profileImage(profileImageUrl: string) {
  const image = await loadImage(profileImageUrl);

  const konvaImage = new Konva.Image({
    x: 17,
    y: 17,
    width: 153,
    height: 230,
    // @ts-ignore
    image: image,
    stroke: "white",
    strokeWidth: 3,
    cornerRadius: 5,
  });

  return konvaImage;
}

async function plate(plateInfo: PlateInfo) {
  const plateCanvas = createCanvas(700, 200);

  await renderServerPlate(plateCanvas, plateInfo);

  return new Konva.Image({
    x: 35,
    y: 215,
    width: 250,
    height: 72,
    // @ts-ignore
    image: plateCanvas,
  });
}

async function konvaText({
  x,
  y,
  width,
  height,
  text,
  fontSize,
  ellipsis,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  text: string;
  ellipsis?: boolean;
}) {
  fontSize = fontSize || 24;

  return new Konva.Text({
    x,
    y,
    text,
    width,
    height,
    fontSize,
    fontFamily: "Jua",
    fill: "white",
    wrap: "none",
    ellipsis,
  });
}

async function box({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return new Konva.Rect({
    x,
    y,
    width,
    height,
    fill: "#737373",
    cornerRadius: 8,
    opacity: 0.9,
  });
}

export async function renderOgProfileImage(
  userInfo: UserInfo,
  gameInfo: GameInfo,
  plateInfo: PlateInfo,
) {
  await initRendering();

  const stage = new Konva.Stage({ width: 600, height: 315 } as unknown as {
    width: number;
    height: number;
    container: string; // 타입 상 container를 필수로 요구하게 되어 있으나, 서버에서 렌더링 하는 경우에는 필수가 아님
  });

  const layer = new Konva.Layer();

  layer.add(await backgroundImage());

  if (userInfo.profileImageUrl)
    layer.add(await profileImage(userInfo.profileImageUrl));

  layer.add(await plate(plateInfo));
  layer.add(
    await konvaText({
      x: 180,
      y: 18,
      text:
        "이름: " +
        (userInfo.switchInfo?.name || userInfo.twitterInfo?.name || ""),
    }),
  );
  layer.add(
    await konvaText({
      x: 180,
      y: 54,
      text: "친구 코드: " + (userInfo.switchInfo?.friendCode || ""),
    }),
  );

  layer.add(await box({ x: 180, y: 85, width: 400, height: 40 }));

  layer.add(await box({ x: 180, y: 135, width: 400, height: 72 }));
  layer.add(
    await konvaText({
      x: 190,
      y: 140,
      width: 380,
      height: 60,
      fontSize: 20,
      text: userInfo.introductionMessage || "",
      ellipsis: true,
    }),
  );

  stage.add(layer);

  stage.draw();

  return stage.toDataURL();
}
