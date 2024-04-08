"use client";
import { useDebounceEdit } from "@/app/lib/hooks/use-profile-store";
import { useDebounceTagEdit } from "@/app/plate/lib/store/use-tag-store";

import { Auth } from "@supabase/auth-ui-react";
import useUser = Auth.useUser;

type DebounceEditingProps = {
  userId: string;
};

export function DebounceEditing(props: DebounceEditingProps) {
  const { userId } = props;
  const user = useUser();
  useDebounceEdit(userId, userId === user.user?.id);
  useDebounceTagEdit(userId);
  return <></>;
}
