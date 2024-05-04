"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ko } from "@/app/lib/supabase-auth-ui-localization";
import { useRouter } from "next/navigation";
import { CLIENT_COMPONENT, SplatfileClient } from "@/app/lib/supabase-client";
import { useEffect } from "react";
import { baseUrl } from "@/app/plate/lib/const";
import useUser = Auth.useUser;

type LoginViewProps = {};

export function LoginView(_: LoginViewProps) {
  const client = new SplatfileClient(CLIENT_COMPONENT);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/users/${user.id}/profile`);
    }
  }, [router, user]);

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <Auth
          localization={{
            variables: ko,
          }}
          redirectTo={baseUrl + "/users/signin"}
          providers={["twitter"]}
          supabaseClient={client.supabase}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
