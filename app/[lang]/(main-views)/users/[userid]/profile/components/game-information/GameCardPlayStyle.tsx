import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { useState } from "react";
import Image from "next/image";
import {
  setPlayStyle,
  setPlayStyleDropIn,
  setRuleFavor,
  usePlayStyle,
  useRuleFavor,
} from "@/app/lib/hooks/use-profile-store";
import {
  CASUAL,
  isKeyOfRuleFavor,
  isKeyOfXmatch,
  NEWBIE,
  playStyleEnum,
  PlayStyleEnumObject,
  PlayStyleKeysObject,
  RuleFavorEnum,
  RuleFavorObject,
  ruleFavorRules,
  ruleFavors,
} from "@/app/lib/schemas/profile/game-info";
import { z } from "zod";
import { Checkbox } from "@headlessui/react";

type GameCardPlayStyleProps = {};

export function GameCardPlayStyle(props: GameCardPlayStyleProps) {
  const [edit, setEdit] = useState(false);

  return (
    <EditableInlineTextCard
      title={"플레이 스타일"}
      edit={edit}
      setEdit={setEdit}
      childrenClassName={"justify-center w-full"}
    >
      {edit ? <EditPlayCard /> : <ViewPlayStyleCard />}
    </EditableInlineTextCard>
  );
}

function EditPlayCard() {
  return (
    <div
      className={
        "flex w-full flex-col items-stretch justify-center gap-4 sm:flex-row sm:gap-12"
      }
    >
      <div>
        <h3 className={"p-2 text-center font-semibold text-gray-600"}>
          게임 유형 별
        </h3>
        <div
          className={
            "flex flex-col items-center justify-center gap-2 sm:flex-row"
          }
        >
          <div>
            <p className={"text-center text-lg"}>오픈</p>
            <EditPlayStyleItem playKey={"open"} />
          </div>
          <div>
            <p className={"text-center text-lg"}>레귤러</p>
            <EditPlayStyleItem playKey={"regular"} />
          </div>
          <div>
            <p className={"text-center text-lg"}>난입</p>
            <div className={" w-full justify-center"}>
              <EditDropInItem />
            </div>
          </div>
        </div>
      </div>
      <div className={""}>
        <h3 className={"mb-4 text-center font-semibold text-gray-600"}>
          룰 별 선호도
        </h3>
        <div
          className={
            "grid grid-cols-2 items-center gap-2 md:mt-2 md:grid-cols-3"
          }
        >
          {ruleFavorRules.map((rule, i) => {
            if (!isKeyOfRuleFavor(rule)) return null;
            return (
              <div key={i} className={"flex w-full gap-0.5"}>
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
    </div>
  );
}

function ViewPlayStyleCard() {
  return (
    <div className={"flex w-full justify-center gap-6"}>
      <div>
        <h3 className={"mb-4 text-center font-semibold text-gray-600"}>
          게임 유형 별
        </h3>
        <div
          className={
            "flex flex-col items-center justify-center gap-2 px-4 sm:flex-row sm:gap-8"
          }
        >
          <div className={"flex flex-col items-center justify-center"}>
            <h3 className={"text-center text-lg text-neutral-800"}>오픈</h3>
            <PlayStyleItem playKey={"open"} />
          </div>
          <div className={"flex flex-col items-center justify-center"}>
            <h3 className={"text-center text-lg text-neutral-800"}>레귤러</h3>
            <PlayStyleItem playKey={"regular"} />
          </div>
          <div className={"flex flex-col items-center justify-center"}>
            <h3 className={"text-center text-lg text-neutral-800"}>난입</h3>
            <div className={"flex justify-center"}>
              <p>{getDropIn(usePlayStyle()?.dropIn)}</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className={"mb-4 text-center font-semibold text-gray-600"}>
          룰 별 선호도
        </h3>
        <div
          className={
            "grid grid-cols-2 items-center gap-x-4 gap-y-2 sm:gap-y-1 md:grid-cols-3"
          }
        >
          {ruleFavorRules.map((rule, i) => {
            if (!isKeyOfRuleFavor(rule)) return null;
            return <RuleFavorItem key={i} rule={rule} />;
          })}
        </div>
      </div>
    </div>
  );
}

type PlayStyleItemProps = {
  playKey: z.infer<typeof PlayStyleKeysObject>;
};

function EditPlayStyleItem({ playKey }: PlayStyleItemProps) {
  const playStyle = usePlayStyle();
  return (
    <select
      className="rounded-md px-2 text-black"
      value={playStyle?.[playKey]}
      onChange={(e) => {
        const parsed = PlayStyleEnumObject.safeParse(e.target.value);
        if (parsed.success) {
          setPlayStyle(playKey, parsed.data);
        }
      }}
    >
      {playStyleEnum.map((playKey) => (
        <option key={playKey} value={playKey}>
          {getPlayStyle(playKey)}
        </option>
      ))}
    </select>
  );
}

function EditDropInItem() {
  const playStyle = usePlayStyle();
  const [enabled, setEnabled] = useState(playStyle?.dropIn);

  const checkDropIn = (e: boolean) => {
    setPlayStyleDropIn(e);
    setEnabled(e);
  };

  return (
    <Checkbox
      checked={enabled}
      onChange={checkDropIn}
      className="group mx-auto mt-1 block size-5 rounded border bg-white data-[checked]:bg-blue-500"
    >
      {/* Checkmark icon */}
      <svg
        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Checkbox>
  );
}

function PlayStyleItem({ playKey }: PlayStyleItemProps) {
  const playStyle = usePlayStyle();
  return (
    <div
      className={"flex w-full items-center justify-center gap-0.5 text-center"}
    >
      <p className={"w-full"}>{getPlayStyle(playStyle?.[playKey])}</p>
    </div>
  );
}

function RuleFavorItem({
  rule,
}: {
  rule: keyof z.infer<typeof RuleFavorObject>;
}) {
  const ruleFavor = useRuleFavor();
  const favor = ruleFavor?.[rule];

  return (
    <div className={"flex w-full items-center justify-center gap-0.5"}>
      <div className={"h-6 w-6"}>
        <Image
          width={24}
          height={24}
          src={`/ingames/${
            isKeyOfXmatch(rule) ? rule + ".webp" : rule + ".png"
          }`}
          alt={`${rule} Icon`}
        />
      </div>
      <p>{getRuleFavorEmoji(favor)}</p>
    </div>
  );
}

type RuleFavorSelectProps = {
  rule: keyof z.infer<typeof RuleFavorObject>;
};

function RuleFavorSelect({ rule }: RuleFavorSelectProps) {
  const ruleFavor = useRuleFavor();

  return (
    <select
      className="rounded-md px-2 text-black"
      value={ruleFavor?.[rule]}
      onChange={(e) => {
        const parsed = RuleFavorEnum.safeParse(e.target.value);
        if (parsed.success) {
          setRuleFavor(rule, parsed.data);
        }
      }}
    >
      {ruleFavors.map((favor, i) => (
        <option key={i} value={favor}>
          {getRuleFavorEmoji(favor)}
        </option>
      ))}
    </select>
  );
}

const getRuleFavorEmoji = (favor: z.infer<typeof RuleFavorEnum>) => {
  return favor === "love"
    ? "☀️"
    : favor === "like"
      ? "🌤️"
      : favor === "normal"
        ? "☁️"
        : favor === "dislike"
          ? "🌧️"
          : favor === "hate"
            ? "⚡"
            : "☀️";
};

const getDropIn = (dropIn?: boolean) => {
  return dropIn ? "환영" : "X";
};

const getPlayStyle = (style: z.infer<typeof PlayStyleEnumObject>) => {
  return style === NEWBIE ? "뉴비" : style == CASUAL ? "캐주얼" : "빡겜";
};
