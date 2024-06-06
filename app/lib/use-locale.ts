"use client";
import { Lang } from "@/app/lib/types/component-props";
import { Locale } from "./locales/locale";
import { useEffect, useState } from "react";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";

import { useParams } from "next/navigation";

const getLocaleByLang = (lang: Lang) => {
  switch (lang) {
    case "ko":
      return ko;
    case "en":
      return en;
    case "ja":
      return ja;
    default:
      return en;
  }
};

export const useLocale = () => {
  const [locale, setLocale] = useState<Locale>(en);
  const params = useParams();

  useEffect(() => {
    const lang = params.lang as Lang;
    setLocale(getLocaleByLang(lang));
  }, [params]);

  return locale;
};
