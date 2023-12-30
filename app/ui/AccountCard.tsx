import { NintendoSwitchLogo } from "@/app/ui/icons/NintendoSwitchLogo";
import { SquidLogo } from "@/app/ui/icons/SquidLogo";
import { ReactNode } from "react";
import { XLogo } from "@/app/ui/icons/XLogo";

export function AccountCard() {
  const { nintendoNickname, splatoonNickname } = {
    nintendoNickname: "Splatfile",
    splatoonNickname: "Splat Nick",
  };

  const { xName, xHandle } = {
    xName: "Splatfile",
    xHandle: "splat_shooter",
  };

  const weekDayTime = "오후 7시 ~ 10시";
  const weekendTime = "오후 2시 ~ 10시";

  return (
    <div
      className={
        "flex flex-col justify-center gap-2 bg-white px-2 py-12 sm:px-24"
      }
    >
      <h2 className={"pb-2 pt-6 text-xl"}>계정 정보</h2>
      <div
        className={
          "bottom-auto grid grid-cols-1 content-around gap-6 sm:grid-cols-3"
        }
      >
        <TextCard title={"닉네임"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"mt-2 flex items-center gap-2"}>
              <div className={"h-6 w-6 text-[#d42d22]"}>
                <NintendoSwitchLogo className={"h-6 w-6"} />
              </div>
              <p className={"font-medium text-neutral-700"}>
                {nintendoNickname}
              </p>
            </div>
            <div className={"flex items-center gap-2"}>
              <div className={"fill-[#d42d22] text-[#d42d22]"}>
                <SquidLogo className={"h-6 w-6"} />
              </div>
              <p className={"font-medium text-neutral-700"}>
                {splatoonNickname}
              </p>
            </div>
          </div>
        </TextCard>

        <InlineTextCard title={<XLogo className={"h-6 w-6"} />}>
          <p className={"text-md text-neutral-900 sm:text-center"}>{xName}</p>
          <a
            href={`https://twitter.com/${xHandle}`}
            className={"text-sm font-medium text-gray-400 sm:text-center"}
          >
            @{xHandle}
          </a>
        </InlineTextCard>
        <InlineTextCard title={"성별"}>
          <p className={"text-md text-neutral-500 sm:text-center"}>남성</p>
        </InlineTextCard>
      </div>
      <div
        className={
          "mt-4 flex w-full min-w-60  items-center justify-center gap-4 sm:flex-row"
        }
      >
        <TextCard title={"평일 접속 시간"}>
          <p className={"text-md text-neutral-500 sm:text-center"}>
            {weekDayTime}
          </p>
        </TextCard>
        <TextCard title={"주말 접속 시간"}>
          <p className={"text-md text-neutral-500 sm:text-center"}>
            {weekendTime}
          </p>
        </TextCard>
      </div>
    </div>
  );
}

export type TextCardProps = {
  title: ReactNode;
  children: ReactNode;
};

// 모바일에서만 한줄로 보임
export function TextCard(props: TextCardProps) {
  return (
    <div
      className={
        "flex w-full flex-col items-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm sm:w-auto sm:items-center sm:justify-center sm:px-4 sm:py-12"
      }
    >
      <h3 className={"text-lg font-bold sm:text-xl"}>{props.title}</h3>
      <div className={"flex flex-col gap-2 font-semibold text-neutral-700"}>
        {props.children}
      </div>
    </div>
  );
}

export type InlineTextCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export function InlineTextCard(props: InlineTextCardProps) {
  return (
    <div
      className={
        "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm sm:w-auto sm:flex-col sm:items-center sm:justify-center sm:px-4 sm:py-12"
      }
    >
      <h3 className={"text-lg font-bold sm:text-xl"}>{props.title}</h3>
      <div className={"flex flex-col gap-1 font-semibold text-neutral-700"}>
        {props.children}
      </div>
    </div>
  );
}
