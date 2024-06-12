"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { localeCookieName } from "@/i18n-config";

export function LocaleSetter() {
  const params = useParams();
  useEffect(() => {
    setCookie(localeCookieName, params["lang"] as string);
  }, [params]);
  return <></>;
}

export function setCookie(name: string, val: string) {
  const date = new Date();
  const value = val;
  date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);

  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
}
