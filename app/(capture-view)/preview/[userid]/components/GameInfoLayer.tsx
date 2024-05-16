"use client";
import { Image as KonvaImage, Layer, Rect, Text } from "react-konva";
import useImage from "use-image";

import { jua } from "@/app/fonts";
import { useGameStore } from "@/app/lib/hooks/use-profile-store";
import { salmonRunRanksKo } from "@/app/lib/schemas/profile/game-info";

type TextWithIconProps = {
  x: number;
  y: number;
  iconSize?: number;
  iconType: "level" | "salmon" | "rank" | "area" | "fish" | "clam" | "tower";
  text: string;
  textSize?: number;
};

function TextWithIcon({
  x,
  y,
  iconSize,
  iconType,
  text,
  textSize,
}: TextWithIconProps) {
  iconSize = iconSize || 32;
  textSize = textSize || 24;

  const iconTypeToUrl = {
    level: "/ingames/level.png",
    salmon: "/ingames/salmon.png",
    rank: "/ingames/ranked.png",
    area: "/ingames/area.png",
    fish: "/ingames/fish.png",
    clam: "/ingames/clam.png",
    tower: "/ingames/tower.png",
  };

  const [image] = useImage(iconTypeToUrl[iconType]);

  return (
    <>
      <KonvaImage
        x={x}
        y={y}
        image={image}
        width={iconSize}
        height={iconSize}
      />
      <Text
        x={x + iconSize + 5}
        y={y + (iconSize - textSize) / 2}
        text={text}
        fill="white"
        fontFamily={"Splat-Title, " + jua.style.fontFamily}
        fontSize={textSize}
        lineHeight={1.3}
      />
    </>
  );
}

type SummaryRectProps = {
  gameStore: ReturnType<typeof useGameStore>;
};

function SummaryRect({ gameStore }: SummaryRectProps) {
  return (
    <>
      <Rect
        x={358}
        y={150}
        width={620}
        height={90}
        cornerRadius={12}
        fill="#737373"
        opacity={0.9}
      />
      <TextWithIcon
        x={375}
        y={160}
        iconType="level"
        text={gameStore.level?.toString() || "-"}
      />
      <TextWithIcon
        x={535}
        y={160}
        iconType="rank"
        text={gameStore.anarchyBattleRank?.grade || "-"}
      />
      <TextWithIcon
        x={695}
        y={160}
        iconType="salmon"
        text={
          gameStore.salmonRunRank?.grade
            ? salmonRunRanksKo[gameStore.salmonRunRank.grade]
            : "-"
        }
      />
      <TextWithIcon
        x={375}
        y={195}
        iconType="area"
        text={gameStore.xMatchInfo?.area || "-"}
      />
      <TextWithIcon
        x={535}
        y={195}
        iconType="tower"
        text={gameStore.xMatchInfo?.tower || "-"}
      />
      <TextWithIcon
        x={695}
        y={195}
        iconType="fish"
        text={gameStore.xMatchInfo?.fish || "-"}
      />
      <TextWithIcon
        x={855}
        y={195}
        iconType="clam"
        text={gameStore.xMatchInfo?.clam || "-"}
      />
    </>
  );
}

type WeaponInfoProps = {
  gameStore: ReturnType<typeof useGameStore>;
};

function WeaponInfo({ gameStore }: WeaponInfoProps) {
  const weaponKeys = Object.keys(gameStore.weaponGearInfo ?? {}).filter(
    (w) => gameStore.weaponGearInfo?.[w]?.isActivated,
  );

  const slicedWeaponKeys = weaponKeys.slice(0, 8);

  const WeaponIcon = ({
    x,
    y,
    weaponKey,
  }: {
    x: number;
    y: number;
    weaponKey: string;
  }) => {
    const [image] = useImage(`/ingames/weapons/mains/${weaponKey}.png`);
    return (
      <>
        <Rect
          x={x}
          y={y}
          width={50}
          height={50}
          cornerRadius={20}
          fill="#737373"
          opacity={0.9}
        />
        <KonvaImage x={x + 1} y={y + 1} image={image} width={48} height={48} />
      </>
    );
  };

  return (
    <>
      <Text
        x={355}
        y={270}
        text="사용 무기:"
        fill="white"
        fontFamily={jua.style.fontFamily}
        fontSize={28}
      />
      {slicedWeaponKeys.map((weapon, index) => {
        return (
          <WeaponIcon
            x={475 + index * 60}
            y={255}
            weaponKey={weapon}
            key={index}
          />
        );
      })}
      {weaponKeys.length > 8 && (
        <Text
          x={475 + 8 * 60}
          y={270}
          text={`+${weaponKeys.length - 8}`}
          fill="#737373"
          fontFamily={jua.style.fontFamily}
          fontSize={28}
        />
      )}
    </>
  );
}

type GameInfoLayerProps = {
  gameStore: ReturnType<typeof useGameStore>;
};

export function GameInfoLayer({ gameStore }: GameInfoLayerProps) {
  return (
    <Layer>
      <SummaryRect gameStore={gameStore} />
      <WeaponInfo gameStore={gameStore} />
    </Layer>
  );
}
