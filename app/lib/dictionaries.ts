import "server-only";
import { Lang } from "@/app/lib/types/component-props";

const dictionaries = {
  ko: () => import("./locales/ko.json").then((module) => module.default),
  en: () => import("./locales/en.json").then((module) => module.default),
  ja: () => import("./locales/ja.json").then((module) => module.default),
};

export const getDictionary = async (lang: Lang) => {
  if (!dictionaries[lang]) {
    return dictionaries["ko"]();
  }
  return dictionaries[lang]();
};

export const getHtml = (text: string) => {
  return {
    dangerouslySetInnerHTML: {
      __html: text,
    },
  };
};
