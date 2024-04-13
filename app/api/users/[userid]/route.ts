import { NextRequest } from "next/server";
import { createCanvas, loadImage } from "canvas";
import { getProfile, ROUTER } from "@/app/lib/supabase-client";
import {
  canvasHeight,
  canvasWidth,
  getFriendCodeText,
  getLevelTitleText,
  getNameText,
  getPlaytimeTitleText,
  getRegularLevelText,
  getWeaponTitleText,
  getWeekdayText,
  getWeekendTimeText,
  isPlateInfo,
  matchPointRect,
  PlateInfoObject,
  plateRect,
  profileImageRect,
  renderMatchPoint,
  renderRankLevelImageAngGetText,
  renderSalmonLevelImageAndGetText,
  renderText,
  renderWeapons,
} from "@/app/lib/utils/server-render-preview-canvas";

import { chunkArrayInGroups } from "@/app/lib/utils/array";
import {
  GameInfoObject,
  isGameInfo,
  salmonRunRanksKo,
} from "@/app/lib/schemas/profile/game-info";
import QRCode from "qrcode";
import { isUserInfo, UserInfoObject } from "@/app/lib/schemas/profile";
import { renderServerPlate } from "@/app/lib/utils/server-render-plate";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/app/lib/server/supabase-client";
import { baseUrl } from "@/app/plate/lib/const";
import directoryTree from "directory-tree";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      userid: string;
    };
  },
) {
  try {
    return new Response(await renderOgImage(params), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);
    let tree = "";
    directoryTree(process.cwd(), {}, (item, PATH) => {
      tree += item.path + "\n";
    });

    return new Response("Internal Server Error: " + error + "\n" + tree, {
      status: 500,
    });
  }
}

const renderOgImage = async (params: { userid: string }) => {
  console.log("params: ", params);
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const plate = createCanvas(700, 200);

  const renderBackground = async () => {
    const image = await loadImage(baseUrl + "/background/body.png");

    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };

  const renderImage = async (profileImageUrl: string) => {
    if (!profileImageUrl) return;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = await loadImage(profileImageUrl);

    ctx.drawImage(image, ...profileImageRect);
  };

  if (params.userid) {
    const adminClient = createSupabaseServiceClient(ROUTER);
    const profile = await getProfile(adminClient, params.userid);
    const { user_info, game_info, plate_info } = profile;

    if (
      !isUserInfo(user_info) ||
      !isGameInfo(game_info) ||
      !isPlateInfo(plate_info)
    ) {
      return;
    }

    const renderCanvas = async (
      tag: z.infer<typeof PlateInfoObject>,
      userStore: z.infer<typeof UserInfoObject>,
      gameStore: z.infer<typeof GameInfoObject>,
    ) => {
      if (!canvas || !plate) return;

      console.log("Render Plate");
      await renderServerPlate(plate, tag);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // Background
      console.log("Render Background");
      await renderBackground();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#222222";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Profile Image
      const profileImageUrl = user_info.profileImageUrl;
      if (profileImageUrl) {
        console.log("Render Profile Image");
        await renderImage(profileImageUrl);
      }

      ctx.drawImage(plate, ...plateRect);

      // Left Text Side
      const nameText = getNameText(
        userStore.switchInfo?.name || userStore.twitterInfo?.name || "",
      );
      const weekendText = getWeekendTimeText(userStore.weekendPlaytime);

      // Left Text Side Rect
      ctx.strokeStyle = "#dddddd";
      ctx.lineWidth = 3;

      // const y = nameText.y - topPadding / 2 - topPadding - defaultFontSize;
      // drawRoundedRect(
      //   ctx,
      //   nameText.x - leftPadding / 2,
      //   y,
      //   leftSideWidth,
      //   weekendText.y - y + defaultFontSize,
      //   12,
      //   "#bbbbbb",
      //   0.5,
      // );

      // Left Text Side Render
      renderText(ctx, nameText);
      renderText(
        ctx,
        getFriendCodeText(userStore.switchInfo?.friendCode || ""),
      );
      renderText(ctx, getPlaytimeTitleText());
      renderText(ctx, getWeekdayText(userStore.weekdayPlaytime));

      renderText(ctx, weekendText);

      const weaponTitleText = getWeaponTitleText();
      renderText(ctx, weaponTitleText);

      const weaponKeys = Object.keys(gameStore.weaponGearInfo ?? {}).filter(
        (w) => gameStore.weaponGearInfo?.[w]?.isActivated,
      );

      const filteredWeapons = chunkArrayInGroups(
        weaponKeys,
        Math.floor(weaponKeys.length / 2),
      );

      console.log("Render Weapons");
      await renderWeapons(
        ctx,
        filteredWeapons,
        getWeaponTitleText().x,
        getWeaponTitleText().y + 20,
      );

      // Right Text Side
      console.log("Render Level Title Text");
      const levelTitleText = getLevelTitleText();
      renderText(ctx, levelTitleText);
      // renderText(ctx, levelTitleText);

      const regularLevelText = await getRegularLevelText(
        ctx,
        levelTitleText,
        `${gameStore?.level || ""}`,
      );
      renderText(ctx, regularLevelText);

      const rankLevelText = await renderRankLevelImageAngGetText(
        ctx,
        regularLevelText,
        `${gameStore?.anarchyBattleRank?.grade || ""}`,
      );
      renderText(ctx, rankLevelText);

      const salmonGrade = gameStore?.salmonRunRank?.grade;
      const salmonLevelText = await renderSalmonLevelImageAndGetText(
        ctx,
        rankLevelText,
        `${salmonGrade ? salmonRunRanksKo[salmonGrade] : ""}`,
      );
      renderText(ctx, salmonLevelText);

      if (gameStore.anarchyBattleRank?.grade === "S+") {
        console.log("Render Match Point");
        const rect = matchPointRect(ctx, regularLevelText);
        await renderMatchPoint(ctx, rect, gameStore.xMatchInfo);
      }
      const qrUrlRegex =
        "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";
      if (
        userStore.switchInfo?.friendLink &&
        userStore.switchInfo.friendLink.match(qrUrlRegex)
      ) {
        console.log("Render QR");

        const qrCode = await QRCode.toBuffer(userStore.switchInfo.friendLink, {
          margin: 1,
          color: { light: "#dddddd" },
        });

        const size = 180;

        const qrImage = await loadImage(qrCode);

        ctx.drawImage(
          qrImage,
          canvasWidth - size,
          canvasHeight - size,
          size,
          size,
        );
      }
    };
    await renderCanvas(plate_info, user_info, game_info);
  }
  return canvas.toBuffer();
};
