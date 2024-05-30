"use client";

import { useState } from "react";
import { EditableTextCard } from "@/app/ui/components/TextCard";
import {
  setPlaytime,
  useMine,
  usePlaytime,
} from "@/app/lib/hooks/use-profile-store";
import { format } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { Account } from "@/app/lib/locales/locale";
import { useParams } from "next/navigation";
import { Lang } from "@/app/lib/types/component-props";

type PlayTimeCardProps = {
  account: Account;
  timeType: "weekdayPlaytime" | "weekendPlaytime";
};

const getDateFnsLocale = (lang: Lang) => {
  switch (lang) {
    case "ko":
      return ko;
    case "en":
      return enUS;
    case "ja":
      return ja;
    default:
      return enUS;
  }
};

export const PlaytimeCard = (props: PlayTimeCardProps) => {
  const { timeType, account } = props;
  const [edit, setEdit] = useState(false);
  const playtime = usePlaytime(timeType);
  const isMine = useMine();
  const params = useParams();
  const lang = params.lang as Lang;

  if (!playtime && !isMine) return null;
  if (!isMine && (!playtime?.start || !playtime?.end)) return null;

  const start = new Date(2020, 0, 1, playtime?.start ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedStart = start
    ? format(start, "a hh", { locale: getDateFnsLocale(lang) })
    : "";

  const end = new Date(2020, 0, 1, playtime?.end ?? 0); // 날짜는 임의로 설정
  // AM/PM 형태로 포매팅
  const formattedEnd = end
    ? format(end, "a hh", { locale: getDateFnsLocale(lang) })
    : "";

  return (
    <EditableTextCard
      title={
        timeType === "weekdayPlaytime"
          ? account.ui_weekday_playtime
          : account.ui_weekend_playtime
      }
      edit={edit}
      setEdit={setEdit}
    >
      {edit ? (
        <EditPlayTimeCard
          timeType={timeType}
          playtime={playtime}
          account={account}
        />
      ) : (
        !!playtime?.start &&
        !!playtime?.end && (
          <p className={"text-md text-neutral-500 md:w-72 md:text-center"}>
            {formattedStart} ~ {formattedEnd}
          </p>
        )
      )}
    </EditableTextCard>
  );
};

type EditPlayTimeCardProps = {
  account: Account;
  timeType: "weekdayPlaytime" | "weekendPlaytime";
  playtime?: { start: number; end: number };
};

export const EditPlayTimeCard = (props: EditPlayTimeCardProps) => {
  const { account, timeType, playtime } = props;

  const onChange = (key: "start" | "end", value: string) => {
    if (!value) return;
    const otherKey = key === "start" ? "end" : "start";
    setPlaytime(timeType, {
      [key]: parseInt(value),
      [otherKey]: playtime?.[otherKey] ?? 0,
    });
  };

  return (
    <div className={"px-4 "}>
      <div className={"flex justify-center gap-2"}>
        <div className={"flex gap-1"}>
          <p>{account.ui_start_time}</p>
          <input
            type="number"
            min={0}
            max={23}
            value={playtime?.start ?? 0}
            onChange={(e) => {
              onChange("start", e.target.value);
            }}
          />
        </div>
        <div className={"flex gap-1"}>
          <p>{account.ui_end_time}</p>
          <input
            type="number"
            min={0}
            max={23}
            value={playtime?.end ?? 0}
            onChange={(e) => {
              onChange("end", e.target.value);
            }}
          />
        </div>
      </div>
      <p className={"px-2 pt-4 text-center text-sm text-gray-400"}>
        00~23시 사이의 숫자를 입력해주세요.
      </p>
    </div>
  );
};
