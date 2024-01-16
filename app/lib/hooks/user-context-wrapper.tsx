"use client";

import { createSupabaseClientComponentClient } from "../supabase-client";
import { Auth } from "@supabase/auth-ui-react";
import { ReactNode } from "react";
import UserContextProvider = Auth.UserContextProvider;

type UserContextWrapperProps = {
  children: ReactNode;
};

export function UserContextWrapper(props: UserContextWrapperProps) {
  const supabaseClient = createSupabaseClientComponentClient();
  return (
    <UserContextProvider supabaseClient={supabaseClient}>
      {props.children}
    </UserContextProvider>
  );
}
