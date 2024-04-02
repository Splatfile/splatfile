"use client";

import {
  setSwitchInfo,
  useEditStore,
  useSwitchInfo,
} from "@/app/lib/hooks/use-profile-store";
import { useState } from "react";
import { SwitchInfo } from "@/app/lib/schemas/profile";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { clsx } from "clsx";
import { NintendoSwitchLogo } from "@/app/ui/icons/NintendoSwitchLogo";
import { EditableText } from "@/app/ui/components/EditableText";
import { SquidLogo } from "@/app/ui/icons/SquidLogo";

type SwitchInfoCardProps = {};
export const SwitchInfoCard = (props: SwitchInfoCardProps) => {
  const switchInfo = useSwitchInfo();
  const { isMine } = useEditStore();

  const [edit, setEdit] = useState(false);

  if (!isMine && !switchInfo) {
    return null;
  }

  const onChange = (key: keyof SwitchInfo, value: string) => {
    setSwitchInfo(key, value);
  };

  return (
    <EditableInlineTextCard title={"닉네임"} edit={edit} setEdit={setEdit}>
      <div className={"flex flex-col gap-2"}>
        <div
          className={clsx("mt-2 flex items-center gap-2", {
            hidden: !switchInfo?.name && !edit,
          })}
        >
          <div className={"h-6 w-6 text-[#d42d22]"}>
            <NintendoSwitchLogo className={"h-6 w-6"} />
          </div>
          <EditableText
            edit={edit}
            value={switchInfo?.name ?? ""}
            placeholder={"스위치 닉네임"}
            inputClassName={
              "w-full underline underline-offset-2 outline-none max-w-full"
            }
            onChange={(value) => onChange("name", value)}
          />
        </div>
        <div
          className={clsx("mt-2 flex items-center gap-2", {
            hidden: !switchInfo?.inGameName && !edit,
          })}
        >
          <div className={"h-6 w-6 fill-[#d42d22] text-[#d42d22]"}>
            <SquidLogo className={"h-6 w-6"} />
          </div>
          <EditableText
            edit={edit}
            value={switchInfo?.inGameName ?? ""}
            placeholder={"스플래툰 닉네임"}
            inputClassName={
              "w-full underline underline-offset-2 outline-none max-w-full"
            }
            onChange={(value) => onChange("inGameName", value)}
          />
        </div>
      </div>
    </EditableInlineTextCard>
  );
};
