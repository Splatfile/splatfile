"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ko } from "@/app/lib/supabase-auth-ui-localization";
import { useRouter } from "next/navigation";
import {
  CLIENT_COMPONENT,
  createSupabaseClient,
} from "@/app/lib/supabase-client";
import { useEffect } from "react";
import useUser = Auth.useUser;

type LoginButtonProps = {};

export function LoginView(props: LoginButtonProps) {
  const supabaseClient = createSupabaseClient(CLIENT_COMPONENT);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/users/${user.id}/profile`);
    }
  }, [router, user]);

  async function signInWithTwitter() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "twitter",
    });
  }

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <button onClick={signInWithTwitter}>Twitter 로그인</button>

        <Auth
          localization={{
            variables: ko,
          }}
          redirectTo={"https://splatfile.vercel.app/users/signin"}
          providers={["twitter"]}
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
