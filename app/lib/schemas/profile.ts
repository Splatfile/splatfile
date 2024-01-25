type ServerRegion = "KR/HK" | "JP" | "EU" | "NA/SA/AT/NC";
type RankRule = "Area" | "Fish" | "Clam" | "Tower";
type Rule = RankRule | "Regular" | "SalmonRun";

type XMatchInfo = {
  [K in RankRule as Lowercase<K>]?: string;
};
/*
엑스 매치 정보
{
  area: "23+"
  fish: "2503.4"
}
*/

type RuleFavoriteInfo = {
  [K in Rule as Lowercase<K>]?: string;
};
/*
룰별 선호도
{
  area: "🤔" TODO: 좀 더 효율적으로 표현할 수 있을지 고민해보기
  salmonrun: "🤔"
}
*/

type PlayStyle = "Newbie" | "Gachi" | "Casual"; // 뉴비 / 진심 (일본어로 Gachi) / 캐주얼

import { codes as mainWeaponCodes } from "@/app/lib/constants/weapons/mains";
type MainWeaponCode = typeof mainWeaponCodes[number];

import { codes as subWeaponCodes } from "@/app/lib/constants/weapons/subs";
type SubWeaponCode = typeof subWeaponCodes[number];

import { codes as specialWeaponCodes } from "@/app/lib/constants/weapons/specials";
type SpecialWeaponCode = typeof specialWeaponCodes[number];

import { gearPowerCodes } from "@/app/lib/constants/weapons/etc";
type GearPowerCode = typeof gearPowerCodes[number];

import {
  battleMapCodes,
  codes as mapCodes,
  salmonRunMapCodes,
} from "@/app/lib/constants/maps";
type MapCode = typeof mapCodes[number];
type BattleMapCode = typeof battleMapCodes[number];
type SalmonRunMapCode = typeof salmonRunMapCodes[number];

export type WeaponGearInfo = {
  mainWeapon: MainWeaponCode;
  subWeapon: SubWeaponCode;
  specialWeapon: SpecialWeaponCode;
  gearPowers: {
    head: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
    body: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
    shoes: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
  };
  rules: Rule[];
}; // 무기와 기어 정보

type TwitterInfo = {
  name: string;
  id: string;
};

type SwitchInfo = {
  name: string;
  inGameName?: string;
  friendCode?: string;
  friendLink?: string;
};

export type UserInfo = {
  nickname: string;
  profileImageUrl?: string;
  splatplateImageUrl?: string;
  twitterInfo?: TwitterInfo;
  switchInfo?: SwitchInfo;
  gender?: string;
  introductionMessage?: string;
  languages?: string[];
  favoritePlayHours?: [number, number];
};

export type GameInfo = {
  serverRegion?: ServerRegion;
  level?: number;
  anarchyBattleRank?: string;
  salmonRunRank?: string;
  xMatchInfo?: XMatchInfo;
  ruleFavoriteInfo?: RuleFavoriteInfo;
  playStyle?: PlayStyle;
};
