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

  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://splatfile.vercel.app";

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <Auth
          localization={{
            variables: ko,
          }}
          redirectTo={baseURL + "/users/signin"}
          providers={["twitter"]}
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
