"use client";

import { useState } from "react";
import { EditableTextCard } from "@/app/ui/components/TextCard";

export const WeekdayPlayTimeCard = () => {
  const [edit, setEdit] = useState(false);
  const weekDayTime = "오후 7시 ~ 10시";

  return (
    <EditableTextCard title={"평일 접속 시간"} edit={edit} setEdit={setEdit}>
      <p className={"text-md text-neutral-500 md:w-72 md:text-center"}>
        {weekDayTime}
      </p>
    </EditableTextCard>
  );
};
export const WeekendPlayTimeCard = () => {
  const [edit, setEdit] = useState(false);
  const weekendTime = "오후 2시 ~ 10시";

  return (
    <EditableTextCard title={"주말 접속 시간"} edit={edit} setEdit={setEdit}>
      <div className={"flex flex-col gap-2 font-semibold text-neutral-700"}>
        <p className={"text-md text-neutral-500 md:w-72 md:text-center"}>
          {weekendTime}
        </p>
      </div>
    </EditableTextCard>
  );
};
