"use client";

import { useRef, useState } from "react";
import {
  setTwitterInfo,
  useEditStore,
  useTwitterInfo,
} from "@/app/lib/hooks/use-profile-store";
import { TwitterInfo } from "@/app/lib/schemas/profile";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { XLogo } from "@/app/ui/icons/XLogo";
import { EditableText } from "@/app/ui/components/EditableText";
import { Account } from "@/app/lib/locales/locale";

type TwitterInfoCardProps = {
  account: Account;
};

export const TwitterInfoCard = (props: TwitterInfoCardProps) => {
  const { account } = props;
  const [edit, setEdit] = useState(false);
  const twitterInfo = useTwitterInfo();
  const { isMine } = useEditStore();
  const xNicknameRef = useRef<HTMLInputElement>(null);
  const handleRef = useRef<HTMLInputElement>(null);

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
        ref={xNicknameRef}
        edit={edit}
        value={name ?? ""}
        placeholder={account.ui_twitter_nickname}
        textClassName={"text-center"}
        inputClassName={
          "w-full underline underline-offset-2 outline-none max-w-full"
        }
        onChange={onChange("name")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRef.current?.focus();
          }
        }}
      />

      {edit ? (
        <div className={"flex gap-1"}>
          <span>@</span>
          <input
            ref={handleRef}
            type="text"
            className={"w-full max-w-full underline underline-offset-2"}
            placeholder={account.ui_twitter_handle}
            value={id}
            onChange={(e) => {
              onChange("id")(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setEdit(false);
              }
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
