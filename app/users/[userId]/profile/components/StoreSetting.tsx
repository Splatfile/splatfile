"use client";
import {
  initProfileStore,
  useDebounceEdit,
} from "@/app/lib/hooks/use-profile-store";
import { useEffect } from "react";
import { Profile } from "@/app/lib/types/supabase-alias";
import { Auth } from "@supabase/auth-ui-react";
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
  useEffect(() => {
    initProfileStore(profile, userId === user.user?.id);
  }, [profile, isMine, userId, user]);
  return null;
}
