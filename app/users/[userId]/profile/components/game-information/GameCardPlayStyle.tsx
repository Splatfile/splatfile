import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useState } from "react";
import Image from "next/image";
import { setRuleFavor, usePlayStyle } from "@/app/lib/hooks/use-profile-store";
import {
  isKeyOfRuleFavor,
  isKeyOfXmatch,
  PlayStyleObject,
  ruleFavor,
  RuleFavorEnum,
  ruleFavorRules,
} from "@/app/lib/schemas/profile/game-info";
import { z } from "zod";

type GameCardPlayStyleProps = {};

export function GameCardPlayStyle(props: GameCardPlayStyleProps) {
  const [edit, setEdit] = useState(false);

  return (
    <EditableInlineTextCard
      title={"플레이 스타일"}
      edit={edit}
      setEdit={setEdit}
    >
      {edit ? <EditPlayCard /> : <ViewPlayStyleCard />}
    </EditableInlineTextCard>
  );
}

function EditPlayCard() {
  return (
    <div className={"flex items-center justify-center"}>
      {/*<div className={"flex flex-col items-center justify-center"}>*/}
      {/*  <h3 className={"font-semibold"}>레귤러</h3>*/}
      {/*  <p className={"text-neutral-700"}>즐겜</p>*/}
      {/*</div>*/}

      <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
        {ruleFavorRules.map((rule, i) => {
          if (!isKeyOfRuleFavor(rule)) return null;
          return (
            <div key={i} className={"flex w-full gap-2"}>
              <Image
                width={24}
                height={24}
                src={`/ingames/${
                  isKeyOfXmatch(rule) ? rule + ".webp" : rule + ".png"
                }`}
                alt={`${rule} Icon`}
              />
              <RuleFavorSelect rule={rule} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ViewPlayStyleCard() {
  return (
    <div className={"grid grid-cols-2 gap-4 md:mt-2"}>
      {ruleFavorRules.map((rule, i) => {
        if (!isKeyOfRuleFavor(rule)) return null;
        return <RuleFavorItem key={i} rule={rule} />;
      })}
    </div>
  );
}

function RuleFavorItem({
  rule,
}: {
  rule: keyof z.infer<typeof PlayStyleObject>;
}) {
  const playStyle = usePlayStyle();
  const favor = playStyle?.[rule];

  return (
    <div className={"flex w-full gap-2"}>
      <Image
        width={24}
        height={24}
        src={`/ingames/${isKeyOfXmatch(rule) ? rule + ".webp" : rule + ".png"}`}
        alt={`${rule} Icon`}
      />
      <p>
        {favor === "love"
          ? "☀️"
          : favor === "like"
            ? "🌤️"
            : favor === "normal"
              ? "☁️"
              : favor === "dislike"
                ? "🌧️"
                : favor === "hate"
                  ? "⚡"
                  : "☀️"}
      </p>
    </div>
  );
}

type RuleFavorSelectProps = {
  rule: keyof z.infer<typeof PlayStyleObject>;
};

function RuleFavorSelect({ rule }: RuleFavorSelectProps) {
  const playStyle = usePlayStyle();

  return (
    <select
      className="rounded-md px-2 text-black"
      value={playStyle?.[rule]}
      onChange={(e) => {
        const parsed = RuleFavorEnum.safeParse(e.target.value);
        if (parsed.success) {
          setRuleFavor(rule, parsed.data);
        }
      }}
    >
      {ruleFavor.map((favor, i) => (
        <option key={i} value={favor}>
          {favor === "love"
            ? "☀️"
            : favor === "like"
              ? "🌤️"
              : favor === "normal"
                ? "☁️"
                : favor === "dislike"
                  ? "🌧️"
                  : favor === "hate"
                    ? "⚡"
                    : "☀️"}
        </option>
      ))}
    </select>
  );
}
