"use client";

import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import {
  setXMatchPoint,
  useEditStore,
  useGameStore,
} from "@/app/lib/hooks/use-profile-store";
import { ChangeEvent, useRef, useState } from "react";
import { isKeyOfXmatch, XMatchInfo } from "@/app/lib/schemas/profile/game-info";
import { IngameLocale } from "@/app/lib/locales/locale";
import { GameInfo } from "@/app/lib/types/type-checker";

type GameCardXMatchProps = {
  gameInfo: GameInfo;
  ingameLocale: IngameLocale;
};

export function GameCardXMatch(props: GameCardXMatchProps) {
  const { gameInfo, ingameLocale } = props;
  const { xMatchInfo, anarchyBattleRank } = useGameStore();
  const { isMine } = useEditStore();
  const [edit, setEdit] = useState(false);

  if (anarchyBattleRank?.grade !== "S+") return null;

  if (!xMatchInfo && !isMine) {
    return null;
  }

  return (
    <EditableInlineTextCard
      edit={edit}
      title={ingameLocale.ui_x_match}
      setEdit={setEdit}
    >
      {edit ? (
        <XMatchCardEdit setEdit={setEdit} />
      ) : (
        <XMatchCardView xMatchInfo={xMatchInfo} />
      )}
    </EditableInlineTextCard>
  );
}

type XMatchCardViewProps = {
  xMatchInfo?: XMatchInfo;
};

const XMatchCardView = (props: XMatchCardViewProps) => {
  const { xMatchInfo } = props;
  if (!xMatchInfo) {
    return null;
  }

  const { area, clam, fish, tower } = xMatchInfo;
  return (
    <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
      {area && (
        <div className={"flex w-full items-center gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/area.webp"
            alt="Splatoon Level Icon"
          />
          <p>{area}</p>
        </div>
      )}
      {clam && (
        <div className={"flex items-center gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/clam.webp"
            alt="Splatoon Salmon Icon"
          />
          <p>{clam}</p>
        </div>
      )}
      {fish && (
        <div className={"flex items-center gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/fish.webp"
            alt="Splatoon Rank Icon"
          />
          <p>{fish}</p>
        </div>
      )}
      {tower && (
        <div className={"flex items-center gap-2"}>
          <Image
            width={24}
            height={24}
            src="/ingames/tower.webp"
            alt="Splatoon Salmon Icon"
          />
          <p>{tower}</p>
        </div>
      )}
    </div>
  );
};

type XMatchCardEditProps = {
  setEdit: (edit: boolean) => void;
};

const XMatchCardEdit = (props: XMatchCardEditProps) => {
  const { isMine } = useEditStore();
  const { xMatchInfo, anarchyBattleRank } = useGameStore();

  const areaRef = useRef<HTMLInputElement>(null);
  const clamRef = useRef<HTMLInputElement>(null);
  const fishRef = useRef<HTMLInputElement>(null);
  const towerRef = useRef<HTMLInputElement>(null);

  if (anarchyBattleRank?.grade !== "S+" || !isMine) {
    return null;
  }

  const { area, fish, clam, tower } = xMatchInfo ?? {
    area: "",
    fish: "",
    clam: "",
    tower: "",
  };
  const onChangePoint = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    if (!isKeyOfXmatch(key)) {
      throw new Error(`Invalid key for XMatchInfo: ${key}`);
    }
    setXMatchPoint(key, e.target.value);
  };

  return (
    <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
      <div className={"flex w-full gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/area.webp"
          alt="Splatoon Area Icon"
        />
        <label htmlFor={"area"} className={"hidden"}>
          Area Level
        </label>
        <input
          ref={areaRef}
          className={"w-24"}
          id={"area"}
          name={"area"}
          onChange={onChangePoint}
          placeholder={"2100+"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              clamRef.current?.focus();
            }
          }}
          value={area}
        />
      </div>
      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/clam.webp"
          alt="Splatoon clam Icon"
        />
        <label htmlFor={"clam"} className={"hidden"}>
          Clam Level
        </label>
        <input
          ref={clamRef}
          className={"w-24"}
          id={"clam"}
          name={"clam"}
          onChange={onChangePoint}
          placeholder={"2341"}
          value={clam}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fishRef.current?.focus();
            }
          }}
        />
      </div>
      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/fish.webp"
          alt="Splatoon Fish Icon"
        />
        <label htmlFor={"fish"} className={"hidden"}>
          Fish Level
        </label>
        <input
          ref={fishRef}
          className={"w-24"}
          id={"fish"}
          name={"fish"}
          onChange={onChangePoint}
          placeholder={"20+"}
          value={fish}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              towerRef.current?.focus();
            }
          }}
        />
      </div>
      <div className={"flex gap-2"}>
        <Image
          width={24}
          height={24}
          src="/ingames/tower.webp"
          alt="Splatoon Tower Icon"
        />
        <label htmlFor={"tower"} className={"hidden"}>
          Tower Level
        </label>
        <input
          ref={towerRef}
          className={"w-24"}
          id={"tower"}
          name={"tower"}
          onChange={onChangePoint}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.setEdit(false);
            }
          }}
          placeholder={"X"}
          value={tower}
        />
      </div>
    </div>
  );
};
