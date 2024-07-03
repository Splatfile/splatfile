"use client";
import { initProfileStore } from "@/app/lib/hooks/use-profile-store";
import { useEffect } from "react";
import { Profile } from "@/app/lib/types/supabase-alias";
import { Auth } from "@supabase/auth-ui-react";
import { initializeTagStore } from "@/app/plate/lib/store/use-tag-store";
import useUser = Auth.useUser;

type StoreSettingProps = {
  profile: Profile;
  userId: string;
  isMine: boolean;
};

export default function StoreSetting(props: StoreSettingProps) {
  const { profile, isMine, userId } = props;
  const user = useUser();
  useEffect(() => {
    initProfileStore(profile, isMine);
    initializeTagStore(profile);
  }, [profile, isMine, userId, user]);
  return null;
}
