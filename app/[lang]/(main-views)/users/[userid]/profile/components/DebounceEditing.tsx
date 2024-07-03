"use client";
import { useDebounceEdit } from "@/app/lib/hooks/use-profile-store";
import { useDebounceTagEdit } from "@/app/plate/lib/store/use-tag-store";

import { Auth } from "@supabase/auth-ui-react";
import { Lang } from "@/app/lib/types/component-props";
import { Err } from "@/app/lib/locales/locale";
import useUser = Auth.useUser;

type DebounceEditingProps = {
  lang: Lang;
  err: Err;
  userId: string;
};

export default function DebounceEditing(props: DebounceEditingProps) {
  const { userId, lang, err } = props;
  const user = useUser();

  useDebounceEdit(userId, userId === user.user?.id, err, lang);
  useDebounceTagEdit(userId, userId === user.user?.id, err, lang);
  return <></>;
}
