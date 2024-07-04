"use client";

import { useRef, useState } from "react";
import { setTwitterInfo } from "@/app/lib/hooks/use-profile-store";
import { TwitterInfo } from "@/app/lib/schemas/profile";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { XLogo } from "@/app/ui/icons/XLogo";
import { EditableText } from "@/app/ui/components/EditableText";
import { UserInfo } from "@/app/lib/types/type-checker";
import { AccountLocale } from "@/app/lib/locales/locale";

type TwitterInfoCardProps = {
  userInfo: UserInfo;
  accountLocale: AccountLocale;
  isMine: boolean;
};

export const TwitterInfoCard = (props: TwitterInfoCardProps) => {
  const { accountLocale, userInfo, isMine } = props;
  const [edit, setEdit] = useState(false);
  const twitterInfo = userInfo.twitterInfo;
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
        placeholder={accountLocale.ui_twitter_nickname}
        textClassName={"text-left sm:text-center"}
        inputClassName={
          "w-full underline underline-offset-2 outline-none max-w-full"
        }
        onChange={onChange("name")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleRef.current?.focus();
          }
        }}
        emptytext={accountLocale.ui_empty_card_text}
      />

      {edit ? (
        <div className={"flex gap-1"}>
          <span>@</span>
          <input
            ref={handleRef}
            type="text"
            className={"w-full max-w-full underline underline-offset-2"}
            placeholder={accountLocale.ui_twitter_handle}
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
