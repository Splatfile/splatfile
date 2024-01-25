export const MAIN = "main";
export const SUB = "sub";
export const SPECIAL = "special";
export const WEAPON_TYPES = [MAIN, SUB, SPECIAL] as const;
export type WeaponType = typeof WEAPON_TYPES[number];

export const BATTLE_MAP = "Versus";
export const SALMONRUN_MAP = "Coop";
export const MAP_TYPES = [BATTLE_MAP, SALMONRUN_MAP] as const;
export type MapType = typeof MAP_TYPES[number];

/** ------------------------------------------------------------------------
 *                         data source definitions
 * ------------------------------------------------------------------------**/

export const TARGET_VERSION = "610"; // ex. 610 => v6.1.0
export const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
export type LangCode = typeof SUPPORT_LABEL_LANGUAGES[number];

const WEAPON_INFO_BASEURL =
  `https://raw.githubusercontent.com/Leanny/splat3/main/data/mush/${TARGET_VERSION}/`;
export const WEAPON_INFO_URL_BY_TYPE = {
  [MAIN]: WEAPON_INFO_BASEURL + "WeaponInfoMain.json",
  [SUB]: WEAPON_INFO_BASEURL + "WeaponInfoSub.json",
  [SPECIAL]: WEAPON_INFO_BASEURL + "WeaponInfoSpecial.json",
} as const;

const WEAPON_IMAGE_PREFIX =
  "https://raw.githubusercontent.com/Leanny/splat3/main/images/";
export const WEAPON_IMAGE_BASEURL_BY_TYPE = {
  [MAIN]: WEAPON_IMAGE_PREFIX + "weapon_flat/",
  [SUB]: WEAPON_IMAGE_PREFIX + "subspe/",
  [SPECIAL]: WEAPON_IMAGE_PREFIX + "subspe/",
} as const;

export const MAP_INFO_BASEURL =
  `https://raw.githubusercontent.com/Leanny/splat3/main/data/mush/${TARGET_VERSION}/`;
export const MAP_INFO_URL_BY_TYPE = {
  [BATTLE_MAP]: MAP_INFO_BASEURL + "VersusSceneInfo.json",
  [SALMONRUN_MAP]: MAP_INFO_BASEURL + "CoopSceneInfo.json",
} as const;

const LABEL_DATA_BASE_URL =
  "https://raw.githubusercontent.com/Leanny/splat3/main/data/language/";
export const LABEL_DATA_URL_BY_LANG_CODE = Object.fromEntries(
  SUPPORT_LABEL_LANGUAGES.map(
    (lang) => [lang, LABEL_DATA_BASE_URL + `${lang}_full_unicode.json`],
  ),
);

export const LABEL_KEY_BY_TYPE = {
  [MAIN]: "CommonMsg/Weapon/WeaponName_Main",
  [SUB]: "CommonMsg/Weapon/WeaponName_Sub",
  [SPECIAL]: "CommonMsg/Weapon/WeaponName_Special",
  [BATTLE_MAP]: "CommonMsg/VS/VSStageName",
  [SALMONRUN_MAP]: "CommonMsg/Coop/CoopStageName",
};

/** ------------------------------------------------------------------------
 *                           output definitions
 * ------------------------------------------------------------------------**/

export const OUTPUT_CONSTANT_FILENAME_BY_TYPE = {
  [MAIN]: "app/lib/constants/weapons/mains.ts",
  [SUB]: "app/lib/constants/weapons/subs.ts",
  [SPECIAL]: "app/lib/constants/weapons/specials.ts",
  [BATTLE_MAP]: "app/lib/constants/maps/battle.ts",
  [SALMONRUN_MAP]: "app/lib/constants/maps/salmonrun.ts",
} as const;

export const OUTPUT_IMAGE_DIR_BY_WEAPON_TYPE = {
  [MAIN]: "public/ingames/weapons/mains/",
  [SUB]: "public/ingames/weapons/subs/",
  [SPECIAL]: "public/ingames/weapons/specials/",
} as const;
