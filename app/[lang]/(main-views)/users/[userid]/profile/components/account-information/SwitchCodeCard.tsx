"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";
import { SwitchInfo } from "@/app/lib/schemas/profile";
import {
  setSwitchInfo,
  useSwitchInfo,
} from "@/app/lib/hooks/use-profile-store";
import { clsx } from "clsx";
import { Account } from "@/app/lib/locales/locale";

type SwitchCodeCardProps = {
  account: Account;
};
export const SwitchCodeCard = (props: SwitchCodeCardProps) => {
  const { account } = props;
  const [edit, setEdit] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const switchInfo = useSwitchInfo();

  const { friendCode, friendLink } = switchInfo ?? {
    friendCode: "",
    friendLink: "",
  };

  const qrUrlRegex =
    "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";

  useEffect(() => {
    (async () => {
      if (!switchInfo?.friendLink?.match(qrUrlRegex)) {
        setQrCode("");
        return;
      }
      setQrCode(await QRCode.toDataURL(switchInfo.friendLink));
    })();
  }, [switchInfo]);

  const friendCodeRef = useRef<HTMLInputElement>(null);
  const friendLinkRef = useRef<HTMLInputElement>(null);

  const onChange = (key: keyof SwitchInfo) => {
    return (value: string) => setSwitchInfo(key, value.trim());
  };

  return (
    <EditableInlineTextCard
      title={account.ui_friend_code}
      edit={edit}
      setEdit={setEdit}
    >
      {!friendCode && !qrCode && !edit && (
        <p className={"text-center font-normal text-black opacity-40"}>
          {account.ui_empty_card_text}
        </p>
      )}
      <EditableText
        ref={friendCodeRef}
        edit={edit}
        value={friendCode ?? ""}
        textClassName={clsx(friendCode || "hidden", "text-center")}
        inputClassName={
          "text-center underline underline-offset-2 max-w-full w-full"
        }
        pattern={"[0-9]{4}-[0-9]{4}-[0-9]{4}"}
        placeholder={"1234-5678-9012"}
        onChange={onChange("friendCode")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            friendLinkRef.current?.focus();
          }
        }}
        emptytext={account.ui_empty_card_text}
      />

      <div className={clsx("flex", qrCode || "hidden")}>
        <div
          className={"hidden h-20 w-full items-center justify-center md:flex"}
        >
          <img
            className={clsx("m-auto h-full w-20 object-cover ", {
              "md:hidden": !qrCode,
              "md:block": qrCode,
            })}
            src={qrCode}
            alt={"QR Code"}
          />
        </div>
      </div>

      <a
        className={clsx(
          "text-sm font-medium text-gray-400 md:hidden md:text-center",
          friendLink || "hidden",
          friendLink?.match(qrUrlRegex) || "hidden",
        )}
        href={friendLink}
      >
        {account.ui_add_button}
      </a>

      {edit && (
        <div className={"flex gap-1"}>
          <input
            ref={friendLinkRef}
            type="text"
            className={clsx(
              "w-full max-w-full px-1 underline underline-offset-2",
              friendLink || "text-center",
            )}
            placeholder={account.ui_friend_code_link}
            value={friendLink}
            onChange={(e) => {
              onChange("friendLink")(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEdit(false);
              }
            }}
          />
        </div>
      )}
    </EditableInlineTextCard>
  );
};
