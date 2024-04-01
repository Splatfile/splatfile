"use client";

import { useState } from "react";
import {
  setTwitterInfo,
  useEditStore,
  useTwitterInfo,
} from "@/app/lib/hooks/use-profile-store";
import { TwitterInfo } from "@/app/lib/schemas/profile";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { XLogo } from "@/app/ui/icons/XLogo";
import { EditableText } from "@/app/ui/components/EditableText";

export const TwitterInfoCard = () => {
  const [edit, setEdit] = useState(false);
  const twitterInfo = useTwitterInfo();
  const { isMine } = useEditStore();

  if (!twitterInfo && !isMine) return null;

  if (!twitterInfo?.name && !twitterInfo?.id && !isMine) return null;

  const { id, name } = twitterInfo ?? { id: "", name: "" };

  const onChange = (key: keyof TwitterInfo) => (value: string) => {
    setTwitterInfo(key, value);
  };

  return (
    <EditableInlineTextCard
      title={<XLogo className={"h-6 w-6"} />}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        edit={edit}
        value={name ?? ""}
        placeholder={"트위터 닉네임"}
        textClassName={"text-center"}
        inputClassName={
          "w-full underline underline-offset-2 outline-none max-w-full"
        }
        onChange={onChange("name")}
      />

      {edit ? (
        <div className={"flex gap-1"}>
          <span>@</span>
          <input
            type="text"
            className={"w-full max-w-full underline underline-offset-2"}
            placeholder={"트위터 핸들"}
            value={id}
            onChange={(e) => {
              onChange("id")(e.target.value);
            }}
          />
        </div>
      ) : (
        id && (
          <a
            href={`https://twitter.com/${id}`}
            className={"text-sm font-medium text-gray-400 md:text-center"}
          >
            @{id}
          </a>
        )
      )}
    </EditableInlineTextCard>
  );
};
