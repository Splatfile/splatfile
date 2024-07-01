"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ReactNode } from "react";
import { CLIENT_COMPONENT, SplatfileClient } from "@/app/lib/splatfile-client";
import UserContextProvider = Auth.UserContextProvider;

type UserContextWrapperProps = {
  children: ReactNode;
};

export function UserContextWrapper(props: UserContextWrapperProps) {
  console.log("UserContextWrapper");
  const client = new SplatfileClient(CLIENT_COMPONENT);
  return (
    <UserContextProvider supabaseClient={client.supabase}>
      {props.children}
    </UserContextProvider>
  );
}
