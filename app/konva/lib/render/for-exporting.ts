"use client";
import {
  newBox,
  newTextContainer,
  newImageContainer,
} from "@/app/konva/lib/commons";
import { loadImages } from "@/app/konva/lib/loading-utils";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";
import { renderPlate } from "@/app/plate/lib/render-plate";
import { getSalmonRunRank } from "@/app/lib/schemas/profile/game-info";
import { Locale } from "@/app/lib/locales/locale";
import Konva from "konva";

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 536;

async function renderProfileBase(
  layer: Konva.Layer,
  userInfo: UserInfo,
  plateInfo: PlateInfo,
) {
  // 배경 이미지, 프로필 이미지, 플레이트를 렌더링 합니다.

  const loadedImages = await loadImages(
    {
      backgroundImage: "/background/body.png",
      // 브라우저가 캐싱을 하지 않도록, 이미지 URL에 timestamp를 추가합니다.
      // 캐싱이 되어 있으면, response 헤더를 확인할 수 없기 때문에
      // canvas가 CORS 정책을 위반한것으로 판단합니다.
      profileImage:
        userInfo.profileImageUrl + `?t=${new Date().getTime()}` || "",
    },
    () => {
      layer.batchDraw();
    },
  );

  {
    // 배경 이미지
    const backgroundImage = await newImageContainer({
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      image: loadedImages["backgroundImage"],
      crop: {
        x: 0,
        y: 0,
        width: loadedImages["backgroundImage"].width,
        height:
          loadedImages["backgroundImage"].height *
          (CANVAS_HEIGHT / CANVAS_WIDTH),
      },
    });

    backgroundImage.filters([
      Konva.Filters.Blur,
      Konva.Filters.Contrast,
      Konva.Filters.Brighten,
    ]);
    backgroundImage.blurRadius(2);
    backgroundImage.contrast(0.7);
    backgroundImage.brightness(-0.7);

    layer.add(backgroundImage);
  }

  if (userInfo.profileImageUrl) {
    // 프로필 이미지가 있는 경우, 프로필 이미지를 렌더링합니다.
    layer.add(
      await newImageContainer({
        x: 50,
        y: 50,
        width: 267,
        height: 400,
        image: loadedImages["profileImage"],
        stroke: "white",
        strokeWidth: 4,
        cornerRadius: 5,
      }),
    );
  }

  {
    // 플레이트 렌더링
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 700;
    tempCanvas.height = 200;

    await renderPlate(tempCanvas, plateInfo);

    const plateImage = new Image();
    // 이미지가 정상적으로 로드 될때까지 기다립니다.
    await new Promise((resolve, reject) => {
      plateImage.onload = resolve;
      plateImage.onerror = reject;
      plateImage.src = tempCanvas.toDataURL();
    });

    layer.add(
      await newImageContainer({
        x: 58,
        y: 402,
        width: 300,
        height: 86,
        stroke: "white",
        strokeWidth: 3,
        cornerRadius: 3,
        image: plateImage,
      }),
    );
  }
}

async function renderUserInfo(layer: Konva.Layer, userInfo: UserInfo) {
  const FONT_SIZE = 28;
  // 유저 정보를 렌더링합니다.
  layer.add(
    await newTextContainer({
      x: 358,
      y: 30,
      width: 280,
      fontSize: FONT_SIZE,
      text:
        "이름: " +
        (userInfo.switchInfo?.name || userInfo.twitterInfo?.name || ""),
    }),
  );
  layer.add(
    await newTextContainer({
      x: 180,
      y: 50,
      text: "친구 코드: " + (userInfo.switchInfo?.friendCode || ""),
    }),
  );

  layer.add(await newBox({ x: 180, y: 135, width: 400, height: 72 }));
  layer.add(
    await newTextContainer({
      x: 190,
      y: 142,
      width: 380,
      height: 60,
      fontSize: 20,
      text: userInfo.introductionMessage || "",
      wrap: "none",
      ellipsis: true,
    }),
  );
}

async function renderGameInfo(layer: Konva.Layer, gameInfo: GameInfo) {
  // 게임 정보를 렌더링합니다.
  const loadedImages = await loadImages(
    {
      level: "/ingames/level.png",
      salmon: "/ingames/salmon.png",
      ranked: "/ingames/ranked.png",
    },
    () => {
      layer.batchDraw();
    },
  );

  layer.add(await newBox({ x: 180, y: 82, width: 400, height: 40 }));
  {
    // 레벨
    layer.add(
      await newImageContainer({
        x: 185,
        y: 86,
        width: 32,
        height: 32,
        image: loadedImages.level,
      }),
    );
    layer.add(
      await newTextContainer({
        x: 222,
        y: 90,
        text: gameInfo.level?.toString() || "-",
        fontFamily: "Splat-title",
      }),
    );
  }
  {
    // 연어런
    const salmonRank = gameInfo.salmonRunRank?.grade
      ? getSalmonRunRank("ko", gameInfo.salmonRunRank.grade) // TODO: locale 적용
      : "-";
    layer.add(
      await newImageContainer({
        x: 185 + 133,
        y: 86,
        width: 32,
        height: 32,
        image: loadedImages.salmon,
      }),
      await newTextContainer({
        x: 222 + 133,
        y: 91,
        text: salmonRank,
      }),
    );
  }
  {
    // 랭크
    layer.add(
      await newImageContainer({
        x: 185 + 266,
        y: 86,
        width: 32,
        height: 32,
        image: loadedImages.ranked,
      }),
    );
    layer.add(
      await newTextContainer({
        x: 222 + 266,
        y: 90,
        text: gameInfo.anarchyBattleRank?.grade || "-",
        fontFamily: "Splat-title",
      }),
    );
  }

  const weaponGearInfo = gameInfo.weaponGearInfo || {};
  console.log(weaponGearInfo);
  const mainWeapons = Object.entries(weaponGearInfo)
    .filter(([_, { isActivated }]) => isActivated)
    .map(([key, _]) => key);

  const printableMainWeapons = mainWeapons.slice(0, 3);

  const loadedWeaponImages = await loadImages(
    printableMainWeapons.reduce(
      (acc, weapon, idx) => ({
        ...acc,
        [`weapon${idx}`]: `/ingames/weapons/mains/${weapon}.png`,
      }),
      {},
    ) as Record<string, string>,
    () => {
      layer.batchDraw();
    },
  );

  for (let idx = 0; idx < printableMainWeapons.length; idx++) {
    layer.add(
      await newBox({
        x: 300 + 70 * idx,
        y: 230,
        width: 64,
        height: 64,
        opacity: 0.5,
      }),
    );
    layer.add(
      await newImageContainer({
        x: 300 + 70 * idx,
        y: 230,
        width: 64,
        height: 64,
        image: loadedWeaponImages[`weapon${idx}`],
      }),
    );
  }

  if (mainWeapons.length > 3) {
    layer.add(
      await newBox({
        x: 300 + 70 * 3,
        y: 230,
        width: 64,
        height: 64,
        opacity: 0.5,
      }),
    );
    layer.add(
      await newTextContainer({
        x: 300 + 70 * 3 + 15,
        y: 230 + 20,
        text: `+${mainWeapons.length - 3}`,
        fontSize: 24,
        fontFamily: "Splat-title",
      }),
    );
  }
}

export async function renderProfileImage(
  containerId: string,
  userInfo: UserInfo,
  gameInfo: GameInfo,
  plateInfo: PlateInfo,
) {
  const stage = new Konva.Stage({
    container: containerId,
    width: 1024,
    height: 536,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  await renderProfileBase(layer, userInfo, plateInfo);
  await renderUserInfo(layer, userInfo);
  await renderGameInfo(layer, gameInfo);

  return new Promise<string>((resolve) => {
    stage.batchDraw();

    // 이미지를 redraw요청 후, 150ms 후에 resolve합니다.
    setTimeout(() => resolve(stage.toDataURL()), 150);
  });
}
