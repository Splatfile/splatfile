"use client";

import { useState } from "react";
import { EditableTextCard } from "@/app/ui/components/TextCard";
import { setPlaytime, useMine } from "@/app/lib/hooks/use-profile-store";
import { format } from "date-fns";
import { enUS, ja, ko } from "date-fns/locale";
import { useParams } from "next/navigation";
import { Lang } from "@/app/lib/types/component-props";
import { AccountLocale } from "@/app/lib/locales/locale";
import { UserInfo } from "@/app/lib/types/type-checker";

type PlayTimeCardProps = {
  accountLocale: AccountLocale;
  userInfo: UserInfo;
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
  const { timeType, accountLocale, userInfo } = props;
  const [edit, setEdit] = useState(false);
  const playtime = userInfo[timeType];
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
          ? accountLocale.ui_weekday_playtime
          : accountLocale.ui_weekend_playtime
      }
      edit={edit}
      setEdit={setEdit}
    >
      {edit ? (
        <EditPlayTimeCard
          timeType={timeType}
          playtime={playtime}
          account={accountLocale}
        />
      ) : !!playtime?.start && !!playtime?.end ? (
        <p className={"text-md pt-4 text-neutral-500 md:w-72 md:text-center"}>
          {formattedStart} - {formattedEnd}
        </p>
      ) : (
        <p
          className={
            "text-md pt-4 text-black opacity-40 md:w-72 md:text-center"
          }
        >
          {accountLocale.ui_empty_card_text}
        </p>
      )}
    </EditableTextCard>
  );
};

type EditPlayTimeCardProps = {
  account: AccountLocale;
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
          <select
            value={playtime?.start ?? 0}
            onChange={(e) => {
              onChange("start", e.target.value);
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div className={"flex gap-1"}>
          <p>{account.ui_end_time}</p>
          <select
            value={playtime?.end ?? 0}
            onChange={(e) => {
              onChange("end", e.target.value);
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className={"px-2 pt-4 text-center text-sm text-gray-400"}>
        {account.ui_edit_playtime_description}
      </p>
    </div>
  );
};
