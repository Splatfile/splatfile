"use client";
import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useState } from "react";

import {
  setAnarchyBattleRank,
  setLevel,
  setSalmonRunRank,
  useGameStore,
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
import { Ingame } from "@/app/lib/locales/locale";
import { Lang } from "@/app/lib/types/component-props";

type GameCardCommonProps = {
  lang: Lang;
  ingame: Ingame;
};

export function GameCardCommon(props: GameCardCommonProps) {
  const { ingame, lang } = props;
  const [edit, setEdit] = useState(false);

  return (
    <EditableInlineTextCard
      childrenClassName={
        "!flex-row sm:!flex-col !justify-between !gap-6 sm:!gap-2"
      }
      title={ingame.ui_summary}
      edit={edit}
      setEdit={setEdit}
    >
      <LevelText edit={edit} />
      <RankText edit={edit} />
      <SalmonText lang={lang} edit={edit} />
    </EditableInlineTextCard>
  );
}

export type LevelTextProps = {
  edit: boolean;
};

export const LevelText = ({ edit }: LevelTextProps) => {
  const { level } = useGameStore();

  if (!level && !edit) return <></>;

  const onChangeLevel = (value: string) => {
    const level = parseInt(value);
    if (level < 1) {
      setLevel(1);
    } else if (level > 999) {
      setLevel(999);
    } else {
      setLevel(level);
    }
  };

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
        inputClassName={"w-32 underline underline-offset-2 outline-none"}
        edit={edit}
        value={level ?? 0}
        onChange={onChangeLevel}
      />
    </div>
  );
};
export type RankTextProps = {
  edit: boolean;
};
export const RankText = (props: RankTextProps) => {
  const { edit } = props;
  const { anarchyBattleRank } = useGameStore();

  const onChangeGrade = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isAnarchyBattleRank(e.target.value)) {
      console.error("Invalid AnarchyBattleRank:", e.target.value);
      throw new Error("Invalid AnarchyBattleRank:" + e.target.value);
    }
    setAnarchyBattleRank(e.target.value, anarchyBattleRank?.point ?? 0);
  };

  const onChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const point = parseInt(e.target.value);
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
};
export const SalmonText = (props: SalmonTextProps) => {
  const { edit } = props;
  const { salmonRunRank } = useGameStore();

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
