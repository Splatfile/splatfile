import { useState } from "react";
import {
  setGender,
  useEditStore,
  useGender,
} from "@/app/lib/hooks/use-profile-store";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";

export const GenderCard = () => {
  const [edit, setEdit] = useState(false);
  const { isMine } = useEditStore();
  const gender = useGender();

  if (!isMine && !gender) return null;

  return (
    <EditableInlineTextCard title={"성별"} edit={edit} setEdit={setEdit}>
      <EditableText
        edit={edit}
        value={gender ?? ""}
        onChange={(value) => setGender(value)}
      />
    </EditableInlineTextCard>
  );
};
