"use client";
import { mainsCodes } from "@/app/lib/constants/weapons";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useEffect, useState } from "react";
import {
  setWeaponGearInfo,
  useWeaponGearInfo,
} from "@/app/lib/hooks/use-profile-store";
import { PencilIcon } from "@heroicons/react/20/solid";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import clsx from "clsx";
import { chunkArrayInGroups } from "@/app/lib/utils/array";
import { z } from "zod";
import { WeaponGearInfoObject } from "@/app/lib/schemas/profile/game-info";
import { IngameLocale } from "@/app/lib/locales/locale";
import { GameInfo } from "@/app/lib/types/type-checker";

type GameCardWeaponsProps = {
  gameInfo: GameInfo;
  ingameLocale: IngameLocale;
  isMine: boolean;
};

export function GameCardWeapons(props: GameCardWeaponsProps) {
  const { gameInfo, ingameLocale, isMine } = props;
  const weaponGearInfo = gameInfo.weaponGearInfo;
  const filteredWeapons = chunkArrayInGroups(
    Object.entries(weaponGearInfo ?? {})
      .filter(([_, obj]) => obj?.isActivated)
      .sort(
        ([_, lobj], [__, robj]) =>
          (lobj.selectedTime ?? 0) - (robj.selectedTime ?? 0),
      )
      .map(([key, _]) => key),
    4,
  );
  const [open, setOpen] = useState(false);

  return (
    <InlineTextCard
      childrenClassName={"w-full"}
      title={
        <div className={"flex w-full items-center justify-center gap-2"}>
          <p>{ingameLocale.ui_weapon}</p>
          {isMine && (
            <button
              className={"h-4 w-4 text-neutral-500"}
              onClick={() => setOpen(true)}
            >
              <PencilIcon />
            </button>
          )}
        </div>
      }
    >
      {filteredWeapons.map((weapons, i) => (
        <div key={i} className={"flex items-center justify-center gap-4 py-2"}>
          {weapons.map((w) => (
            <WeaponRenderer key={w} weaponKey={w} />
          ))}
        </div>
      ))}
      <WeaponEditModal
        open={open}
        ingame={ingameLocale}
        onClose={() => setOpen(false)}
      />
    </InlineTextCard>
  );
}

export type WeaponRendererProps = {
  weaponKey: string;
};

export function WeaponRenderer({ weaponKey }: WeaponRendererProps) {
  const weaponGearInfo = useWeaponGearInfo();

  return (
    <div
      className={clsx(
        "h-10 w-10 cursor-pointer rounded-full object-fill outline outline-gray-300 hover:outline-gray-500 sm:min-w-10",
        weaponGearInfo?.[weaponKey]?.isActivated ? "opacity-100" : "opacity-65",
      )}
    >
      <img
        className={"min-h-full min-w-full object-fill"}
        width={40}
        height={40}
        src={"/ingames/weapons/mains/" + weaponKey + ".png"}
        alt={weaponKey + " icon"}
      />
    </div>
  );
}

export function WeaponRendererForSelectModal({
  weaponKey,
}: WeaponRendererProps) {
  const weaponGearInfo = useWeaponGearInfo();

  return (
    <div
      className={clsx(
        "h-12 w-12 min-w-12 cursor-pointer rounded-full object-fill outline outline-gray-300 hover:outline-gray-500 sm:h-16 sm:w-16 sm:min-w-16",
        weaponGearInfo?.[weaponKey]?.isActivated ? "opacity-100" : "opacity-65",
      )}
    >
      <img
        className={"min-h-full min-w-full object-fill"}
        width={40}
        height={40}
        src={"/ingames/weapons/mains/" + weaponKey + ".png"}
        alt={weaponKey + " icon"}
        key={weaponKey}
      />
    </div>
  );
}

type WeaponDetailEditModalProps = {
  weaponKey: string;
  open: boolean;
  onClose: (open: boolean) => void;
};

export function WeaponDetailEditModal({
  weaponKey,
  open,
  onClose,
}: WeaponDetailEditModalProps) {
  return (
    <DefaultModal title={"무기 상세 편집"} open={open} onClose={onClose}>
      <div className={"h-[80vh] max-h-max overflow-scroll"}>
        <p>{weaponKey}</p>
      </div>
    </DefaultModal>
  );
}

type WeaponEditModalProps = {
  ingame: IngameLocale;
  open: boolean;
  onClose: (open: boolean) => void;
};

export function sortedWeapons(
  weaponGearInfo: z.infer<typeof WeaponGearInfoObject>,
) {
  return Object.entries(weaponGearInfo ?? {})
    .filter(([_, w]) => w?.isActivated)
    .toSorted((a, b) => (a[1].selectedTime ?? 0) - (b[1].selectedTime ?? 0));
}

function WeaponEditModal(props: WeaponEditModalProps) {
  const weapons = chunkArrayInGroups<string>([...mainsCodes], 6);
  const weaponGearInfo = useWeaponGearInfo();
  const [selectedWeapons, setSelectedWeapons] = useState(
    sortedWeapons(weaponGearInfo),
  );

  useEffect(() => {
    setSelectedWeapons(sortedWeapons(weaponGearInfo));
  }, [weaponGearInfo]);

  const onActivate = (weaponKey: string) => {
    const gearInfo = { ...weaponGearInfo };
    const activatedCount = Object.keys(gearInfo).filter(
      (w) => gearInfo[w].isActivated,
    ).length;

    if (!gearInfo[weaponKey]) {
      if (activatedCount >= 15) {
        return;
      }
      setWeaponGearInfo({
        ...gearInfo,
        [weaponKey]: {
          isActivated: true,
          gearPowers: {
            head: ["", "", "", ""],
            body: ["", "", "", ""],
            shoes: ["", "", "", ""],
          },
          selectedTime: new Date().getTime(),
          mainWeapon: "",
          rules: [],
          specialWeapon: "",
          subWeapon: "",
        },
      });
    } else {
      setWeaponGearInfo({
        ...gearInfo,
        [weaponKey]: {
          ...gearInfo[weaponKey],
          isActivated: !gearInfo[weaponKey].isActivated,
          selectedTime: new Date().getTime(),
        },
      });
    }
  };

  return (
    <DefaultModal
      title={props.ingame.ui_select_weapon}
      open={props.open}
      onClose={props.onClose}
    >
      <div className={"relative h-[80vh] max-h-max overflow-y-scroll"}>
        {weapons.map((line: string[], i) => (
          <div
            key={i}
            className={"flex items-center justify-center gap-3 py-2 sm:gap-4"}
          >
            {line.map((w) => (
              <button
                key={w}
                onClick={() => onActivate(w)}
                className={clsx(
                  "relative rounded-full",
                  weaponGearInfo?.[w]?.isActivated ? "" : "bg-gray-400/60",
                )}
              >
                <WeaponRendererForSelectModal key={w} weaponKey={w} />
                <p
                  className={clsx(
                    "absolute inset-0 flex items-center justify-center rounded-full text-4xl font-bold text-white/80 decoration-blue-400 decoration-2 hover:text-white/50",
                    weaponGearInfo?.[w]?.isActivated ? "bg-blue-600/20" : "",
                  )}
                >
                  {selectedWeapons.findIndex((sw) => sw[0] === w) + 1 || false}
                </p>
              </button>
            ))}
          </div>
        ))}
      </div>
    </DefaultModal>
  );
}
