"use client";
import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useCallback, useState } from "react";

import {
  setAnarchyBattleRank,
  setLevel,
  setSalmonRunRank,
} from "@/app/lib/hooks/use-profile-store";
import { EditableNumber } from "@/app/ui/components/EditableText";
import {
  anarchyBattleRanks,
  getSalmonRunRank,
  isAnarchyBattleRank,
  isSalmonRunRank,
  salmonRunRanks,
} from "@/app/lib/schemas/profile/game-info";
import {
  rankImageUrl,
  regularImageUrl,
  salmonImageUrl,
} from "@/app/lib/constants/image-urls";
import { Lang } from "@/app/lib/types/component-props";
import clsx from "clsx";
import { useInputNumber } from "@/app/lib/hooks/use-input-number";
import { IngameLocale } from "@/app/lib/locales/locale";
import { GameInfo } from "@/app/lib/types/type-checker";

type GameCardCommonProps = {
  lang: Lang;
  gameInfo: GameInfo;
  ingameLocale: IngameLocale;
  isMine: boolean;
};

export function GameCardCommon(props: GameCardCommonProps) {
  const { ingameLocale, gameInfo, lang, isMine } = props;
  const [edit, setEdit] = useState(false);

  return (
    <EditableInlineTextCard
      childrenClassName={clsx(
        edit || "!flex-row sm:!flex-col !justify-between !gap-5 sm:!gap-2",
      )}
      title={ingameLocale.ui_summary}
      edit={edit}
      setEdit={setEdit}
    >
      <LevelText edit={edit} gameInfo={gameInfo} isMine={isMine} />
      <RankText edit={edit} gameInfo={gameInfo} isMine={isMine} />
      <SalmonText lang={lang} edit={edit} gameInfo={gameInfo} />
    </EditableInlineTextCard>
  );
}

export type LevelTextProps = {
  edit: boolean;
  gameInfo: GameInfo;
  isMine: boolean;
};

export const LevelText = (props: LevelTextProps) => {
  const { edit, gameInfo, isMine } = props;
  const [uiLevel, setUiLevel] = useState<number | string>(gameInfo.level || 0);
  useInputNumber(uiLevel, setUiLevel, gameInfo.level || 0, setLevel);

  const onChangeLevel = useCallback(
    (value: string) => {
      if (!isMine) return;

      const level = parseInt(value);

      if (level < 1) {
        setUiLevel(1);
      } else if (level > 999) {
        setUiLevel(999);
      } else if (isNaN(level)) {
        setUiLevel("");
      } else {
        setUiLevel(level);
      }
    },
    [isMine],
  );

  if (!gameInfo.level && !edit) return <></>;

  return (
    <div className={"flex items-center gap-2"}>
      <div className={"h-6 w-6 md:h-8 md:w-8"}>
        <Image
          width={48}
          height={48}
          src={regularImageUrl}
          alt="Splatoon Level Icon"
        />
      </div>
      <EditableNumber
        inputClassName={
          "w-16 sm:w-32 underline underline-offset-2 outline-none"
        }
        edit={edit}
        value={uiLevel || gameInfo.level || 0}
        onChange={onChangeLevel}
      />
    </div>
  );
};
export type RankTextProps = {
  gameInfo: GameInfo;
  edit: boolean;
  isMine: boolean;
};
export const RankText = (props: RankTextProps) => {
  const { edit, gameInfo, isMine } = props;
  const anarchyBattleRank = gameInfo.anarchyBattleRank;

  const onChangeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isAnarchyBattleRank(e.target.value)) {
      console.error("Invalid AnarchyBattleRank:", e.target.value);
      throw new Error("Invalid AnarchyBattleRank:" + e.target.value);
    }
    setAnarchyBattleRank(e.target.value, anarchyBattleRank?.point ?? 0);
  };

  const onChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const point = parseInt(e.target.value);
    if (isNaN(point)) {
      return;
    }
    setAnarchyBattleRank(
      anarchyBattleRank?.grade || "S+",
      point > 50 ? 50 : point < 0 ? 0 : point,
    );
  };

  if (!anarchyBattleRank && !edit) return <></>;

  return (
    <div className={"flex items-center gap-2"}>
      <div className={"h-6 w-6 md:h-8 md:w-8"}>
        <Image
          width={48}
          height={48}
          src={rankImageUrl}
          alt="Splatoon Rank Icon"
        />
      </div>
      {edit ? (
        <div className={"flex"}>
          <select
            defaultValue={anarchyBattleRank?.grade}
            onChange={onChangeGrade}
          >
            {anarchyBattleRanks.map((rank) => (
              <option key={rank} value={rank}>
                {rank}
              </option>
            ))}
          </select>
          {anarchyBattleRank?.grade?.startsWith("S+") && (
            <input
              onChange={onChangePoint}
              className={"w-20 px-2 underline underline-offset-2 outline-none"}
              type={"number"}
              min={0}
              max={50}
              defaultValue={0}
              value={anarchyBattleRank?.point}
            />
          )}
        </div>
      ) : (
        <p>
          {anarchyBattleRank?.grade}
          {anarchyBattleRank?.grade === "S+" && anarchyBattleRank?.point}
        </p>
      )}
    </div>
  );
};

export type SalmonTextProps = {
  lang: Lang;
  edit: boolean;
  gameInfo: GameInfo;
};
export const SalmonText = (props: SalmonTextProps) => {
  const { edit, gameInfo } = props;
  const salmonRunRank = gameInfo.salmonRunRank;

  const onChangeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isSalmonRunRank(e.target.value)) {
      console.error("Invalid SalmonRunRank:", e.target.value);
      throw new Error("Invalid SalmonRunRank:" + e.target.value);
    }
    setSalmonRunRank(e.target.value);
  };

  if (!salmonRunRank?.grade && !edit) return <></>;

  return (
    <div className={"flex items-center gap-2"}>
      <div className={"h-6 w-6 md:h-8 md:w-8"}>
        <Image
          width={48}
          height={48}
          src={salmonImageUrl}
          alt="Splatoon Salmon Icon"
        />
      </div>
      {edit ? (
        <div className={"flex"}>
          <select onChange={onChangeGrade} defaultValue={salmonRunRank?.grade}>
            {salmonRunRanks.map((rank) => (
              <option key={rank} value={rank}>
                {getSalmonRunRank(props.lang, rank)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>
          {salmonRunRank?.grade &&
            getSalmonRunRank(props.lang, salmonRunRank.grade)}
        </p>
      )}
    </div>
  );
};
