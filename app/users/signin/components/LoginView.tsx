"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupabaseClientComponentClient } from "@/app/lib/supabase-client";
import { ko } from "@/app/lib/supabase-auth-ui-localization";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser = Auth.useUser;

type LoginButtonProps = {};

export function LoginView(props: LoginButtonProps) {
  const supabaseClient = createSupabaseClientComponentClient();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  });
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
