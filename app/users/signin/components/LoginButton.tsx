"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupabaseClientComponentClient } from "@/app/lib/supabase-client";
import { ko } from "@/app/lib/supabase-auth-ui-localization";

type LoginButtonProps = {};

export function LoginButton(props: LoginButtonProps) {
  const supabaseClient = createSupabaseClientComponentClient();

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <Auth
          localization={{
            variables: ko,
          }}
          providers={["twitter"]}
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
