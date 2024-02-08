"use client";
import { EditableTextCard, TextCard } from "@/app/ui/components/TextCard";
import { SwitchInfoCard } from "@/app/users/[userId]/profile/components/account-information/SwitchInfoCard";
import { TwitterInfoCard } from "@/app/users/[userId]/profile/components/account-information/TwitterInfoCard";
import { GenderCard } from "@/app/users/[userId]/profile/components/account-information/GenderCard";
import { SwitchCodeCard } from "@/app/users/[userId]/profile/components/account-information/SwitchCodeCard";
import { useState } from "react";

export function AccountCard() {
  return (
    <div
      className={
        "flex flex-col justify-center gap-2 px-2 py-12 lg:px-8 xl:px-24"
      }
    >
      <h2 className={"pb-2 pt-6 text-xl font-semibold"}>계정 정보</h2>
      <div className={"flex flex-col items-stretch "}>
        <div className={"p-4"}>
          <div
            className={
              "bottom-auto grid grid-cols-1 content-around justify-center gap-6 sm:grid-cols-2 md:grid-cols-4"
            }
          >
            <SwitchInfoCard />
            <TwitterInfoCard /> {/* X / 트위터 */}
            <GenderCard />
            <SwitchCodeCard />
          </div>
          <div
            className={
              "mt-4 flex w-full min-w-60 items-center justify-center gap-4 md:flex-row"
            }
          >
            <WeekdayPlayTimeCard />
            <WeekendPlayTimeCard />
          </div>
        </div>
        <div className={"mx-2 p-2"}>
          <TextCard title={"하고 싶은 말"} wrapperClassName={"h-full"}>
            <p className={"w-full text-left text-lg text-neutral-500"}>
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 부탁드립니다.
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 부탁드립니다.
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 부탁드립니다.
              <br />
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 부탁드립니다.
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 부탁드립니다.
              안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘 <br />
              부탁드립니다.안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘
              부탁드립니다. 안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘
              부탁드립니다.안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘
              부탁드립니다. 안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘
              부탁드립니다.안녕하세요. 스플래툰3를 좋아하는 스플랫입니다. 잘
              <br />
              부탁드립니다. 부탁드립니다.안녕하세요. 스플래툰3를 좋아하는
              스플랫입니다. 잘 부탁드립니다. 안녕하세요. 스플래툰3를 좋아하는
              스플랫입니다. 잘 부탁드립니다.안녕하세요. 스플래툰3를 좋아하는
              스플랫입니다. 잘
            </p>
          </TextCard>
        </div>
      </div>
    </div>
  );
}

const WeekdayPlayTimeCard = () => {
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

const WeekendPlayTimeCard = () => {
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
