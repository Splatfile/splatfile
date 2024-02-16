import { isMatching, P } from "ts-pattern";

export type DefinedBanner = {
  [name: string]: BannerItem[];
};

export type SectionType =
  | "vanilla"
  | "catalog"
  | "jackpot"
  | "bandCustom"
  | "specCustom"
  | "mapsCustom"
  | "lgbtCustom"
  | "miscCustom"
  | "coop"
  | "mode"
  | "shop"
  | "misc"
  | "gear"
  | "spec"
  | "weps"
  | "wepsCustom"
  | "subsCustom"
  | "modeCustom"
  | "gearCustom"
  | "coopCustom"
  | "charCustom"
  | "iconCustom"
  | "spf2Custom"
  | "spf3Custom"
  | "cakeCustom"
  | "userCustom";

export type BannerItem = {
  colour: string;
  file: string;
  layers?: number;
};

export type BannerTitle = {
  name: SectionType;
  id: string;
};

export type Banner = BannerItem | BannerTitle;

export const isBannerItem = (item: Banner): item is BannerItem => {
  return isMatching(
    {
      colour: P.string,
      file: P.string,
    },
    item,
  );
};

export const isBannerItems = (item: unknown): item is BannerItem[] => {
  return isMatching(
    P.array({
      colour: P.string,
      file: P.string,
    }),
    item,
  );
};

export const isBannerTitle = (item: Banner): item is BannerTitle => {
  return isMatching(
    {
      name: P.string,
      id: P.string,
    },
    item,
  );
};

export const isSectionType = (name: string): name is SectionType => {
  return isMatching(
    P.union(
      "vanilla",
      "catalog",
      "jackpot",
      "bandCustom",
      "specCustom",
      "mapsCustom",
      "lgbtCustom",
      "miscCustom",
      "coop",
      "mode",
      "shop",
      "misc",
      "gear",
      "spec",
      "weps",
      "wepsCustom",
      "subsCustom",
      "modeCustom",
      "gearCustom",
      "coopCustom",
      "charCustom",
      "iconCustom",
      "spf2Custom",
      "spf3Custom",
      "cakeCustom",
      "userCustom",
    ),
    name,
  );
};
