"use client";
import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useState } from "react";
import { matchRanks } from "@/app/lib/const";
import { useGameStore } from "@/app/lib/hooks/use-profile-store";

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
  const level = 46;
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
          type="number"
          className={"w-32 underline underline-offset-2 outline-none"}
          value={level}
          onChange={(e) => {
            console.log(e.target.value);
          }}
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
  const rank: string = "S+3";
  if (!rank) return <></>;

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
          <select>
            {matchRanks.map((rank) => (
              <option key={rank}>{rank}</option>
            ))}
          </select>
          {rank.startsWith("S+") && (
            <input
              className={"w-20 px-2"}
              type={"number"}
              minLength={0}
              maxLength={50}
              defaultValue={0}
            />
          )}
        </div>
      ) : (
        <p>{rank}</p>
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
  if (!salmonRunRank) return <></>;

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
          <select>
            {matchRanks.map((rank) => (
              <option key={rank}>{rank}</option>
            ))}
          </select>
          {salmonRunRank?.startsWith("전설") && (
            <input
              className={"w-20 px-2"}
              type={"number"}
              minLength={0}
              maxLength={50}
              defaultValue={0}
            />
          )}
        </div>
      ) : (
        <p>{salmonRunRank}</p>
      )}
      {edit ? (
        <input
          type="text"
          className={"w-32 underline underline-offset-2 outline-none"}
          value={salmonRunRank}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
      ) : (
        <p>{salmonRunRank}</p>
      )}
    </div>
  );
};
