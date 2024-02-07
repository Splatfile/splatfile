"use client";
import { NintendoSwitchLogo } from "@/app/ui/icons/NintendoSwitchLogo";
import { SquidLogo } from "@/app/ui/icons/SquidLogo";
import { XLogo } from "@/app/ui/icons/XLogo";
import {
  EditableInlineTextCard,
  InlineTextCard,
} from "@/app/ui/components/InlineTextCard";
import { TextCard } from "@/app/ui/components/TextCard";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  useEditStore,
  useSwitchInfo,
  useUserStore,
} from "@/app/lib/hooks/use-profile-store";

export function AccountCard() {
  const userInfo = useUserStore();

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

  const qrUrl =
    "https://lounge.nintendo.com/friendcode/1298-1620-0718/DF9vt5MV1G";
  const [qrCode, setQrCode] = useState<string>("");

  const friendCode = "1298-1620-0718";

  useEffect(() => {
    (async () => {
      setQrCode(await QRCode.toDataURL(qrUrl));
    })();
  }, []);

  return (
    <div className={"flex flex-col justify-center gap-2 px-2 py-12 md:px-24"}>
      <h2 className={"pb-2 pt-6 text-xl font-semibold"}>계정 정보</h2>
      <div className={"flex flex-col items-stretch "}>
        <div className={"p-4"}>
          <div
            className={
              "bottom-auto grid grid-cols-1 content-around gap-6 sm:grid-cols-2 md:grid-cols-4"
            }
          >
            {/* X / 트위터 */}
            <InlineTextCard title={<XLogo className={"h-6 w-6"} />}>
              <p className={"text-md text-neutral-900 md:text-center"}>
                {xName}
              </p>
              <a
                href={`https://twitter.com/${xHandle}`}
                className={"text-sm font-medium text-gray-400 md:text-center"}
              >
                @{xHandle}
              </a>
            </InlineTextCard>
            <InlineTextCard title={"성별"}>
              <p className={"text-md text-neutral-500 md:text-center"}>남성</p>
            </InlineTextCard>
            <InlineTextCard title={"친구 코드"}>
              <p className={"text-center"}>{friendCode}</p>

              <div className={"flex"}>
                <div
                  className={
                    "hidden  h-20 w-full items-center justify-center md:flex"
                  }
                >
                  <img
                    className={
                      "m-auto hidden h-full w-20 object-cover md:block"
                    }
                    src={qrCode}
                    alt={"QR Code"}
                  />
                </div>
              </div>
              <a
                className={
                  "text-sm font-medium text-gray-400 md:hidden md:text-center"
                }
                href="https://lounge.nintendo.com/friendcode/1298-1620-0718/DF9vt5MV1G"
              >
                추가하기
              </a>
            </InlineTextCard>
          </div>
          <div
            className={
              "mt-4 flex w-full min-w-60 items-center justify-center gap-4 md:flex-row"
            }
          >
            <TextCard title={"평일 접속 시간"}>
              <p className={"text-md text-neutral-500 md:w-72 md:text-center"}>
                {weekDayTime}
              </p>
            </TextCard>
            <TextCard title={"주말 접속 시간"}>
              <p className={"text-md text-neutral-500 md:w-72 md:text-center"}>
                {weekendTime}
              </p>
            </TextCard>
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

type SwitchInfoCardProps = {
  userInfo: any;
};

const SwitchInfoCard = (props: SwitchInfoCardProps) => {
  const switchInfo = useSwitchInfo();
  const { isMine } = useEditStore();

  const [edit, setEdit] = useState(false);

  if (!isMine && !switchInfo) {
    return null;
  }

  return (
    <EditableInlineTextCard title={"닉네임"} edit={edit} setEdit={setEdit}>
      <div className={"flex flex-col gap-2"}>
        <div className={"mt-2 flex items-center gap-2"}>
          <div className={"h-6 w-6 text-[#d42d22]"}>
            <NintendoSwitchLogo className={"h-6 w-6"} />
          </div>
          <p className={"font-medium text-neutral-700"}>{switchInfo?.name}</p>
        </div>
        <div className={"flex items-center gap-2"}>
          <div className={"fill-[#d42d22] text-[#d42d22]"}>
            <SquidLogo className={"h-6 w-6"} />
          </div>
          <p className={"font-medium text-neutral-700"}>
            {switchInfo?.inGameName}
          </p>
        </div>
      </div>
    </EditableInlineTextCard>
  );
};
