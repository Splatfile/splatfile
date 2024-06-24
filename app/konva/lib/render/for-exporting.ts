"use client";
import {
  newBox,
  newImageContainer,
  newTextContainer,
} from "@/app/konva/lib/commons";
import { loadImages } from "@/app/konva/lib/loading-utils";
import { GameInfo, PlateInfo, UserInfo } from "@/app/lib/types/type-checker";
import { renderPlate } from "@/app/plate/lib/render-plate";
import { getSalmonRunRank } from "@/app/lib/schemas/profile/game-info";
import { Locale } from "@/app/lib/locales/locale";
import Konva from "konva";
import { jua } from "@/app/fonts";

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

    await renderPlate(tempCanvas, plateInfo, plateInfo.language ?? "USen");

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

async function renderUserInfo(
  layer: Konva.Layer,
  userInfo: UserInfo,
  locale: Locale,
) {
  const FONT_SIZE = 28;
  // 유저 정보를 렌더링합니다.
  layer.add(
    await newTextContainer({
      x: 358,
      y: 45,
      width: 280,
      fontSize: FONT_SIZE,
      text:
        `${locale.preview.nickname}: ` +
        (userInfo.switchInfo?.name || userInfo.twitterInfo?.name || ""),
      ellipsis: true,
    }),
  );

  {
    const friendCodeSubtitle = await newTextContainer({
      x: 358 + 280 + 30,
      y: 45 - FONT_SIZE / 2,
      width: 130,
      height: FONT_SIZE * 2,
      verticalAlign: "middle",
      wrap: "word",
      fontSize: FONT_SIZE,
      text: `${locale.preview.friend_code}`,
    });

    layer.add(friendCodeSubtitle);

    layer.add(
      await newTextContainer({
        x: 358 + 280 + 30 + friendCodeSubtitle.getTextWidth() + 5,
        y: 45,
        fontSize: FONT_SIZE,
        text: ": " + (userInfo.switchInfo?.friendCode || "-"),
      }),
    );
  }

  {
    let playTimeText = "";
    if (userInfo.weekdayPlaytime || userInfo.weekendPlaytime) {
      playTimeText = locale.preview.playtime_title + ": ";
      if (userInfo.weekdayPlaytime) {
        playTimeText += `(${locale.preview.playtime_weekday}) ${userInfo.weekdayPlaytime.start
          .toString()
          .padStart(2, "0")}-${userInfo.weekdayPlaytime.end
          .toString()
          .padStart(2, "0")} `;
      }
      if (userInfo.weekendPlaytime) {
        playTimeText += `/ (${locale.preview.playtime_weekend}) ${userInfo.weekendPlaytime.start
          .toString()
          .padStart(2, "0")}-${userInfo.weekendPlaytime.end
          .toString()
          .padStart(2, "0")} `;
      }
    }

    if (playTimeText) {
      layer.add(
        await newTextContainer({
          x: 358,
          y: 100,
          height: FONT_SIZE * 2,
          text: playTimeText,
          fontSize: FONT_SIZE,
        }),
      );
    }
  }

  layer.add(await newBox({ x: 385, y: 325, width: 610, height: 160 }));
  layer.add(
    await newTextContainer({
      x: 400,
      y: 343,
      width: 580,
      height: 135,
      fontSize: 20,
      text: userInfo.introductionMessage || "",
      wrap: "word",
      ellipsis: true,
    }),
  );
}

async function renderGameInfo(
  layer: Konva.Layer,
  gameInfo: GameInfo,
  locale: Locale,
) {
  // 게임 정보를 렌더링합니다.
  const loadedImages = await loadImages(
    {
      level: "/ingames/level.png",
      salmon: "/ingames/salmon.png",
      ranked: "/ingames/ranked.png",
      area: "/ingames/area.png",
      fish: "/ingames/fish.png",
      clam: "/ingames/clam.png",
      tower: "/ingames/tower.png",
    },
    () => {
      layer.batchDraw();
    },
  );

  const renderIconText = async (
    x: number,
    y: number,
    iconImage: HTMLImageElement,
    text: string,
  ) => {
    layer.add(
      await newImageContainer({
        x,
        y,
        width: 32,
        height: 32,
        image: iconImage,
      }),
      await newTextContainer({
        x: x + 37,
        y: y + 4,
        text,
        fontFamily: "Splat-title, " + jua.style.fontFamily,
      }),
    );
  };

  layer.add(await newBox({ x: 358, y: 150, width: 620, height: 90 }));
  {
    // 레벨
    await renderIconText(
      375,
      160,
      loadedImages.level,
      gameInfo.level?.toString() || "-",
    );
  }
  {
    // 랭크
    await renderIconText(
      535,
      160,
      loadedImages.ranked,
      gameInfo.anarchyBattleRank?.grade || "-",
    );
  }
  {
    // 연어런
    const salmonRank = gameInfo.salmonRunRank?.grade
      ? getSalmonRunRank("ko", gameInfo.salmonRunRank.grade) // TODO: locale 적용
      : "-";

    await renderIconText(695, 160, loadedImages.salmon, salmonRank);
  }
  {
    // X매치 정보
    await renderIconText(
      375,
      195,
      loadedImages.area,
      gameInfo.xMatchInfo?.area || "-",
    );
    await renderIconText(
      535,
      195,
      loadedImages.tower,
      gameInfo.xMatchInfo?.tower || "-",
    );
    await renderIconText(
      695,
      195,
      loadedImages.fish,
      gameInfo.xMatchInfo?.fish || "-",
    );
    await renderIconText(
      855,
      195,
      loadedImages.clam,
      gameInfo.xMatchInfo?.clam || "-",
    );
  }

  const weaponGearInfo = gameInfo.weaponGearInfo || {};
  const mainWeapons = Object.entries(weaponGearInfo)
    .filter(([_, { isActivated }]) => isActivated)
    .sort(
      ([_, lobj], [__, robj]) =>
        (lobj.selectedTime ?? 0) - (robj.selectedTime ?? 0),
    )
    .map(([key, _]) => key);

  const WEAPON_MAX_LIMIT = 6;
  const printableMainWeapons = mainWeapons.slice(0, WEAPON_MAX_LIMIT);

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

  const weaponSubTitle = await newTextContainer({
    x: 355,
    y: 256,
    verticalAlign: "middle",
    width: 120,
    height: 56,
    text: locale.preview.used_weapons_title,
    fontSize: 28,
    wrap: "word",
  });
  layer.add(weaponSubTitle);

  for (let idx = 0; idx < printableMainWeapons.length; idx++) {
    layer.add(
      await newBox({
        x: 475 + 70 * idx,
        y: 252,
        width: 64,
        height: 64,
        opacity: 0.5,
      }),
    );
    layer.add(
      await newImageContainer({
        x: 475 + 70 * idx,
        y: 252,
        width: 64,
        height: 64,
        image: loadedWeaponImages[`weapon${idx}`],
      }),
    );
  }

  if (mainWeapons.length > WEAPON_MAX_LIMIT) {
    layer.add(
      await newBox({
        x: 475 + 70 * WEAPON_MAX_LIMIT,
        y: 252,
        width: 64,
        height: 64,
        opacity: 0.5,
      }),
    );
    layer.add(
      await newTextContainer({
        x: 475 + 70 * WEAPON_MAX_LIMIT + 15,
        y: 252 + 20,
        text: `+${mainWeapons.length - 5}`,
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
  locale: Locale,
) {
  const stage = new Konva.Stage({
    container: containerId,
    width: 1024,
    height: 536,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  await renderProfileBase(layer, userInfo, plateInfo);
  await renderUserInfo(layer, userInfo, locale);
  await renderGameInfo(layer, gameInfo, locale);

  return new Promise<string>((resolve) => {
    stage.batchDraw();

    // 이미지를 redraw요청 후, 150ms 후에 resolve합니다.
    setTimeout(() => resolve(stage.toDataURL()), 150);
  });
}
