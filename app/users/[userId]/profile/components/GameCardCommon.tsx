"use client";
import Image from "next/image";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useEffect, useState } from "react";

export function GameCardCommon() {
  const rank = "S+3";
  const salmon = "전설";
  const [edit, setEdit] = useState(false);
  const [isMine, setIsMine] = useState(false);
  useEffect(() => {
    //TODO : check if this is my profile
  });

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
  const rank = "S+3";

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
        <input
          type="text"
          className={"w-32 underline underline-offset-2 outline-none"}
          value={rank}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
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
  const salmon = "전설";

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
        <input
          type="text"
          className={"w-32 underline underline-offset-2 outline-none"}
          value={salmon}
          onChange={(e) => {
            console.log(e.target.value);
          }}
        />
      ) : (
        <p>{salmon}</p>
      )}
    </div>
  );
};
