"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupaaseClientComponentClient } from "@/app/lib/supabase-client";

type LoginButtonProps = {};

export function LoginButton(props: LoginButtonProps) {
  const supabaseClient = createSupaaseClientComponentClient();

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <Auth
          providers={["twitter"]}
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
