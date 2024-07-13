"use client";

import { useState } from "react";
import { setGender } from "@/app/lib/hooks/use-profile-store";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";
import { UserInfo } from "@/app/lib/types/type-checker";
import { AccountLocale } from "@/app/lib/locales/locale";

type GenderCardProps = {
  userInfo: UserInfo;
  accountLocale: AccountLocale;
  isMine: boolean;
};
export const GenderCard = (props: GenderCardProps) => {
  const { accountLocale, userInfo, isMine } = props;
  const [edit, setEdit] = useState(false);
  const gender = userInfo.gender;

  if (!isMine && !gender) return null;

  return (
    <EditableInlineTextCard
      title={accountLocale.ui_gender}
      edit={edit}
      setEdit={setEdit}
      isMine={isMine}
    >
      <EditableText
        edit={edit}
        value={gender ?? ""}
        placeholder={accountLocale.ui_gender_placeholder}
        textClassName={"text-center"}
        inputClassName={"w-full"}
        onChange={(value) => setGender(value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEdit(false);
          }
        }}
        emptytext={accountLocale.ui_empty_card_text}
      />
    </EditableInlineTextCard>
  );
};
