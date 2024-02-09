"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";
import { SwitchInfo } from "@/app/lib/schemas/profile";
import {
  setSwitchInfo,
  useSwitchInfo,
} from "@/app/lib/hooks/use-profile-store";
import { clsx } from "clsx";

export const SwitchCodeCard = () => {
  const [edit, setEdit] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const switchInfo = useSwitchInfo();

  const { friendCode, friendLink } = switchInfo ?? {
    friendCode: "",
    friendLink: "",
  };

  const qrUrl =
    "https://lounge.nintendo.com/friendcode/1298-1620-0718/DF9vt5MV1G";

  const qrUrlRegex =
    "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";

  useEffect(() => {
    (async () => {
      if (!qrUrl.match(qrUrlRegex)) return;
      setQrCode(await QRCode.toDataURL(qrUrl));
    })();
  }, []);

  const onChange = (key: keyof SwitchInfo) => {
    return (value: string) => setSwitchInfo(key, value.trim());
  };

  return (
    <EditableInlineTextCard title={"친구 코드"} edit={edit} setEdit={setEdit}>
      <EditableText
        edit={edit}
        value={friendCode ?? ""}
        textClassName={clsx(friendCode || "hidden")}
        inputClassName={
          "text-center underline underline-offset-2 max-w-full w-full"
        }
        pattern={"[0-9]{4}-[0-9]{4}-[0-9]{4}"}
        placeholder={"1234-5678-9012"}
        onChange={onChange("friendCode")}
      />

      <div className={clsx("flex", qrCode && "hidden")}>
        <div
          className={"hidden  h-20 w-full items-center justify-center md:flex"}
        >
          <img
            className={"m-auto hidden h-full w-20 object-cover md:block"}
            src={qrCode}
            alt={"QR Code"}
          />
        </div>
      </div>

      <a
        className={clsx(
          "text-sm font-medium text-gray-400 md:hidden md:text-center",
          friendLink || "hidden",
          qrUrl.match(qrUrlRegex) || "hidden",
        )}
        href={friendLink}
      >
        추가하기
      </a>

      {edit && (
        <div className={"flex gap-1"}>
          <input
            type="text"
            className={clsx(
              "w-full max-w-full px-1 underline underline-offset-2",
              friendLink || "text-center",
            )}
            placeholder={"친구 코드 링크"}
            value={friendLink}
            onChange={(e) => {
              onChange("friendLink")(e.target.value);
            }}
          />
        </div>
      )}
    </EditableInlineTextCard>
  );
};
