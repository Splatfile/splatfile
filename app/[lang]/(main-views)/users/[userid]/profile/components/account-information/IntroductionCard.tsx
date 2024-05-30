"use client";

import { EditableTextCard } from "@/app/ui/components/TextCard";
import { useState } from "react";
import { EditableParagraph } from "@/app/ui/components/EditableText";
import {
  setIntroductionMessage,
  useIntroductionMessage,
} from "@/app/lib/hooks/use-profile-store";
import { Account } from "@/app/lib/locales/locale";

type AboutMeProps = {
  account: Account;
};

export function IntroductionCard(props: AboutMeProps) {
  const { account } = props;
  const [edit, setEdit] = useState(false);
  const message = useIntroductionMessage();

  const onChange = (message: string) => {
    setIntroductionMessage(message);
  };

  return (
    <EditableTextCard
      title={account.ui_additional_information}
      edit={edit}
      setEdit={setEdit}
    >
      <EditableParagraph
        edit={edit}
        onChange={onChange}
        textClassName={
          "w-full text-left text-lg text-neutral-500 max-w-full lg:max-w-xl text-left"
        }
        textareaClassName={
          "text-left text-sm text-neutral-500 w-full text-left text-lg text-neutral-500 min-h-40 box-border resize-none p-2 shadow-md"
        }
        value={message ?? ""}
        cols={80}
        rows={20}
      />
    </EditableTextCard>
  );
}
