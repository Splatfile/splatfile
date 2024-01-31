import {
  mainsCodes,
  specialsCodes,
  subsCodes,
} from "@/app/lib/constants/weapons"; // 뉴비 / 진심 (일본어로 Gachi) / 캐주얼
import { gearPowerCodes } from "@/app/lib/constants/weapons/etc";
import { battleCodes, salmonrunCodes } from "@/app/lib/constants/maps";
import { isMatching, P } from "ts-pattern";

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

type MainWeaponCode = (typeof mainsCodes)[number];

type SubWeaponCode = (typeof subsCodes)[number];

type SpecialWeaponCode = (typeof specialsCodes)[number];

type GearPowerCode = (typeof gearPowerCodes)[number];

type MapCode = (typeof mapCodes)[number];
type BattleMapCode = (typeof battleCodes)[number];
type SalmonRunMapCode = (typeof salmonrunCodes)[number];

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

export const isUserInfo = (data: unknown): data is UserInfo =>
  isMatching(
    {
      nickname: P.string,
      profileImageUrl: P.string.optional(),
      splatplateImageUrl: P.string.optional(),
      twitterInfo: P.optional({
        name: P.string,
        id: P.string,
      }),
      switchInfo: P.optional({
        name: P.string,
        inGameName: P.string.optional(),
        friendCode: P.string.optional(),
        friendLink: P.string.optional(),
      }),
      gender: P.string.optional(),
      introductionMessage: P.string.optional(),
      languages: P.array(P.string).optional(),
      favoritePlayHours: P.array(P.number).optional(),
    },
    data,
  );

export const isGameInfo = (data: unknown): data is GameInfo =>
  isMatching(
    {
      serverRegion: P.string.optional(),
      level: P.number.optional(),
      anarchyBattleRank: P.string.optional(),
      salmonRunRank: P.string.optional(),
      xMatchInfo: P.optional({
        area: P.string.optional(),
        fish: P.string.optional(),
        clam: P.string.optional(),
        tower: P.string.optional(),
      }),
      ruleFavoriteInfo: P.optional({
        area: P.string.optional(),
        salmonrun: P.string.optional(),
      }),
      playStyle: P.string.optional(),
    },
    data,
  );
