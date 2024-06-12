"use client";

import { Auth } from "@supabase/auth-ui-react";
import { en, ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { ja, ko } from "@/app/lib/supabase-auth-ui-localization";
import { CLIENT_COMPONENT, SplatfileClient } from "@/app/lib/splatfile-client";
import { useEffect } from "react";
import { baseUrl, profileUrl, signinUrl } from "@/app/plate/lib/const";
import { Lang } from "@/app/lib/types/component-props";
import useUser = Auth.useUser;

type LoginViewProps = {
  lang: Lang;
};

const getLocalization = (lang: Lang) => {
  switch (lang) {
    case "en":
      return en;
    case "ko":
      return ko;
    case "ja":
      return ja;
    default:
      return {};
  }
};

export function LoginView(props: LoginViewProps) {
  const { lang } = props;
  const client = new SplatfileClient(CLIENT_COMPONENT);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(profileUrl(user.id));
    }
  }, [router, user]);

  return (
    <div className={"flex w-full justify-center"}>
      <div className={"w-80"}>
        <Auth
          localization={{
            variables: getLocalization(lang),
          }}
          redirectTo={baseUrl + signinUrl}
          providers={["twitter"]}
          supabaseClient={client.supabase}
          appearance={{ theme: ThemeSupa }}
        />
      </div>
    </div>
  );
}
