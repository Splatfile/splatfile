"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ReactNode } from "react";
import {
  CLIENT_COMPONENT,
  createSupabaseClient,
} from "@/app/lib/supabase-client";
import UserContextProvider = Auth.UserContextProvider;

type UserContextWrapperProps = {
  children: ReactNode;
};

export function UserContextWrapper(props: UserContextWrapperProps) {
  const supabaseClient = createSupabaseClient(CLIENT_COMPONENT);
  
  return (
    <UserContextProvider supabaseClient={supabaseClient}>
      {props.children}
    </UserContextProvider>
  );
}
