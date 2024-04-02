import { mainsCodes } from "@/app/lib/constants/weapons";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useState } from "react";
import {
  setWeaponGearInfo,
  useEditStore,
  useWeaponGearInfo,
} from "@/app/lib/hooks/use-profile-store";
import { PencilIcon } from "@heroicons/react/20/solid";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import clsx from "clsx";

type GameCardWeaponsProps = {};

export function GameCardWeapons(props: GameCardWeaponsProps) {
  const weaponGearInfo = useWeaponGearInfo();
  const filteredWeapons = chunkArrayInGroups(
    Object.keys(weaponGearInfo ?? {}).filter(
      (w) => weaponGearInfo?.[w]?.isActivated,
    ),
    4,
  );
  const [open, setOpen] = useState(false);
  const { isMine } = useEditStore();

  return (
    <InlineTextCard
      title={
        <div className={"flex items-center justify-center gap-2"}>
          <p>사용 무기</p>
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
      <WeaponEditModal open={open} onClose={() => setOpen(false)} />
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
        "h-10 w-10 cursor-pointer rounded-full outline outline-gray-300 hover:outline-gray-500",
        weaponGearInfo?.[weaponKey]?.isActivated ? "opacity-100" : "opacity-65",
      )}
    >
      <img src={"/ingames/weapons/mains/" + weaponKey + ".webp"} alt="" />
    </div>
  );
}

function chunkArrayInGroups<T>(arr: T[], size: number) {
  let result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

type WeaponEditModalProps = {
  open: boolean;
  onClose: (open: boolean) => void;
};

function WeaponEditModal(props: WeaponEditModalProps) {
  const weapons = chunkArrayInGroups<string>([...mainsCodes], 8);
  const weaponGearInfo = useWeaponGearInfo();

  const onActivate = (weaponKey: string) => {
    const gearInfo = { ...weaponGearInfo };
    const activatedCount = Object.keys(gearInfo).filter(
      (w) => gearInfo[w].isActivated,
    ).length;

    if (activatedCount >= 15) {
      return;
    }

    if (!gearInfo[weaponKey]) {
      setWeaponGearInfo({
        ...gearInfo,
        [weaponKey]: {
          isActivated: true,
          gearPowers: {
            head: ["", "", "", ""],
            body: ["", "", "", ""],
            shoes: ["", "", "", ""],
          },
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
        },
      });
    }
  };

  return (
    <DefaultModal title={"무기 선택"} open={props.open} onClose={props.onClose}>
      <div className={"h-[80vh] max-h-max overflow-scroll"}>
        {weapons.map((line: string[], i) => (
          <div
            key={i}
            className={"flex items-center justify-center gap-4 py-2"}
          >
            {line.map((w) => (
              <button
                key={w}
                onClick={() => onActivate(w)}
                className={clsx(
                  "rounded-full",
                  weaponGearInfo?.[w]?.isActivated ? "" : "bg-gray-300",
                )}
              >
                <WeaponRenderer key={w} weaponKey={w} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </DefaultModal>
  );
}
