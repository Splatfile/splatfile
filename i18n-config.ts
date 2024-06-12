export const i18n = {
  defaultLocale: "ko",
  locales: ["en", "ko", "ja"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
export const localeCookieName = "splatfile-locale";
