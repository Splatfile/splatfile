"use client";
import { useDebounceEdit } from "@/app/lib/hooks/use-profile-store";
import { useDebounceTagEdit } from "@/app/plate/lib/store/use-tag-store";

import { Auth } from "@supabase/auth-ui-react";
import { Lang } from "@/app/lib/types/component-props";
import useUser = Auth.useUser;

type DebounceEditingProps = {
  lang: Lang;
  userId: string;
};

export function DebounceEditing(props: DebounceEditingProps) {
  const { userId, lang } = props;
  const user = useUser();
  useDebounceEdit(userId, userId === user.user?.id, lang);
  useDebounceTagEdit(userId, userId === user.user?.id, lang);
  return <></>;
}
