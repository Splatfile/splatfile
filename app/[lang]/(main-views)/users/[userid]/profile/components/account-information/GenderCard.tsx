"use client";

import { useState } from "react";
import {
  setGender,
  useEditStore,
  useGender,
} from "@/app/lib/hooks/use-profile-store";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";
import { Account } from "@/app/lib/locales/locale";

type GenderCardProps = {
  account: Account;
};
export const GenderCard = (props: GenderCardProps) => {
  const { account } = props;
  const [edit, setEdit] = useState(false);
  const { isMine } = useEditStore();
  const gender = useGender();

  if (!isMine && !gender) return null;

  return (
    <EditableInlineTextCard
      title={account.ui_gender}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableText
        edit={edit}
        value={gender ?? ""}
        placeholder={account.ui_gender_placeholder}
        textClassName={"text-center"}
        inputClassName={"w-full"}
        onChange={(value) => setGender(value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setEdit(false);
          }
        }}
        emptytext={account.ui_empty_card_text}
      />
    </EditableInlineTextCard>
  );
};
