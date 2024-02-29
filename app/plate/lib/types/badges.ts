export type BadgeCategory =
  | "NAME:mode#badge-gamemodes"
  | "NAME:shop#badge-shops"
  | "NAME:misc#badge-other"
  | "NAME:gear#badge-gear"
  | "NAME:coop#badge-salmon"
  | "NAME:spec#badge-specials"
  | "NAME:weps#badge-weapons";
// | "NAME:wepsCustom#badge-weapons-custom"
// | "NAME:subsCustom#badge-subs-custom"
// | "NAME:modeCustom#badge-modes-custom"
// | "NAME:gearCustom#badge-gear-custom"
// | "NAME:coopCustom#badge-salmon-custom"
// | "NAME:charCustom#badge-chars-custom"
// | "NAME:iconCustom#badge-icons-custom"
// | "NAME:bandCustom#badge-bands-custom"
// | "NAME:spf2Custom#badge-fest2-custom"
// | "NAME:spf2Custom#badge-fest2_intl-custom"
// | "NAME:spf3Custom#badge-fest3-custom"
// | "NAME:cakeCustom#badge-memcake-custom"
// | "NAME:userCustom#badge-upload-custom";

type BadgeFile = string;

export const isBadgeCategory = (item: string): item is BadgeCategory => {
  return item.startsWith("NAME");
};

export type DefinedBadge = Record<BadgeCategory, BadgeFile[]>;
