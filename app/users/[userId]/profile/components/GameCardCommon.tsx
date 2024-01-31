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
import {
  anarchyBattleRanks,
  isAnarchyBattleRank,
  isSalmonRunRank,
  salmonRunRanks,
  salmonRunRanksKo,
} from "@/app/lib/schemas/profile";

export function GameCardCommon() {
  const [edit, setEdit] = useState(false);

  return (
    <EditableInlineTextCard title={"종합"} edit={edit} setEdit={setEdit}>
      <LevelText edit={edit} />
      <RankText edit={edit} />
      <SalmonText edit={edit} />
    </EditableInlineTextCard>
  );
}

export type LevelTextProps = {
  edit: boolean;
};

export const LevelText = ({ edit }: LevelTextProps) => {
  const { level } = useGameStore();

  if (!level && !edit) return <></>;

  const onChangeLevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = parseInt(e.target.value);
    if (level < 1) {
      setLevel(1);
    } else if (level > 999) {
      setLevel(99);
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
          src="/ingames/level.png"
          alt="Splatoon Level Icon"
        />
      </div>
      {edit ? (
        <input
          onChange={onChangeLevel}
          type="number"
          className={"w-32 underline underline-offset-2 outline-none"}
          value={level}
          defaultValue={level}
        />
      ) : (
        <p>{level}</p>
      )}
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
          src="/ingames/ranked.png"
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
              className={"w-20 px-2"}
              type={"number"}
              minLength={0}
              maxLength={50}
              defaultValue={0}
            />
          )}
        </div>
      ) : (
        <p>
          {anarchyBattleRank?.grade}{" "}
          {anarchyBattleRank?.grade === "S+" && anarchyBattleRank?.point}{" "}
        </p>
      )}
    </div>
  );
};

export type SalmonTextProps = {
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
          src="/ingames/salmon.png"
          alt="Splatoon Salmon Icon"
        />
      </div>
      {edit ? (
        <div className={"flex"}>
          <select onChange={onChangeGrade} defaultValue={salmonRunRank?.grade}>
            {salmonRunRanks.map((rank) => (
              <option key={rank} value={rank}>
                {salmonRunRanksKo[rank]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>{salmonRunRank?.grade && salmonRunRanksKo[salmonRunRank.grade]}</p>
      )}
    </div>
  );
};
