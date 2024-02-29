import assets from "../assets.json";
import { BadgeCategory, DefinedBadge, isBadgeCategory } from "./types/badges";

const { badges } = assets;

const initBadges: DefinedBadge = {
  "NAME:mode#badge-gamemodes": [],
  "NAME:shop#badge-shops": [],
  "NAME:misc#badge-other": [],
  "NAME:gear#badge-gear": [],
  "NAME:coop#badge-salmon": [],
  "NAME:spec#badge-specials": [],
  "NAME:weps#badge-weapons": [],
  // "NAME:wepsCustom#badge-weapons-custom": [],
  // "NAME:subsCustom#badge-subs-custom": [],
  // "NAME:modeCustom#badge-modes-custom": [],
  // "NAME:gearCustom#badge-gear-custom": [],
  // "NAME:coopCustom#badge-salmon-custom": [],
  // "NAME:charCustom#badge-chars-custom": [],
  // "NAME:iconCustom#badge-icons-custom": [],
  // "NAME:bandCustom#badge-bands-custom": [],
  // "NAME:spf2Custom#badge-fest2-custom": [],
  // "NAME:spf2Custom#badge-fest2_intl-custom": [],
  // "NAME:spf3Custom#badge-fest3-custom": [],
  // "NAME:cakeCustom#badge-memcake-custom": [],
  // "NAME:userCustom#badge-upload-custom": [],
};

const definedBadges: DefinedBadge = { ...initBadges };
let isInit = false;

export const getDefinedBadges = () => {
  if (isInit) return definedBadges;

  let currentBadgeName: BadgeCategory = "NAME:mode#badge-gamemodes";
  for (const badge of badges) {
    if (isBadgeCategory(badge)) {
      definedBadges[badge] = [];
      currentBadgeName = badge;
    } else {
      definedBadges[currentBadgeName].push(badge);
    }
  }
  // for (const badge of customBadges) {
  //   if (isBadgeCategory(badge)) {
  //     definedBadges[badge] = [];
  //     currentBadgeName = badge;
  //   } else {
  //     definedBadges[currentBadgeName].push(badge);
  //   }
  // }
  isInit = true;
  return definedBadges;
};
