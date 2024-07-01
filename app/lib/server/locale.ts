import { Lang } from "@/app/lib/types/component-props";
import en from "@/app/lib/locales/en.json";
import ja from "@/app/lib/locales/ja.json";
import ko from "@/app/lib/locales/ko.json";

export const getLocaleByLang = (lang: Lang) => {
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
