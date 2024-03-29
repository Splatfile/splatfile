"use client";
import {
  initProfileStore,
  useDebounceEdit,
} from "@/app/lib/hooks/use-profile-store";
import { useEffect } from "react";
import { Profile } from "@/app/lib/types/supabase-alias";
import { Auth } from "@supabase/auth-ui-react";
import {
  initializeTagStore,
  useDebounceTagEdit,
} from "@/app/plate/lib/store/use-tag-store";
import useUser = Auth.useUser;

type StoreSettingProps = {
  profile: Profile;
  userId: string;
  isMine: boolean;
};

export function StoreSetting(props: StoreSettingProps) {
  const { profile, isMine, userId } = props;
  const user = useUser();

  useDebounceEdit(userId, userId === user.user?.id);
  useDebounceTagEdit(userId);
  useEffect(() => {
    initProfileStore(profile, userId === user.user?.id);
    initializeTagStore(profile);
  }, [profile, isMine, userId, user]);
  return null;
}
