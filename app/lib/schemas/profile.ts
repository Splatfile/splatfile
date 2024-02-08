import {
  mainsCodes,
  specialsCodes,
  subsCodes,
} from "@/app/lib/constants/weapons"; // 뉴비 / 진심 (일본어로 Gachi) / 캐주얼
import { gearPowerCodes } from "@/app/lib/constants/weapons/etc";
import { battleCodes, salmonrunCodes } from "@/app/lib/constants/maps";
import { isMatching, P } from "ts-pattern";
import { GameCardXMatch } from "@/app/users/[userId]/profile/components/game-information/GameCardXMatch";

type ServerRegion = "KR/HK" | "JP" | "EU" | "NA/SA/AT/NC";
export type RankRule = "Area" | "Fish" | "Clam" | "Tower";
type Rule = RankRule | "Regular" | "SalmonRun";

export type XMatchInfo = {
  [K in RankRule as Lowercase<K>]?: string;
};

export type SalmonRunMapPoints = {
  dent: number;
  highway: number;
  lift: number;
  ship: number;
  spiral: number;
  up: number;
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

export type TwitterInfo = {
  name: string;
  id: string;
};

export type SwitchInfo = {
  name?: string;
  inGameName?: string;
  friendCode?: string;
  friendLink?: string;
};

export type UserInfo = {
  nickname: string;
  profileImageUrl?: string;
  splatplateImageUrl?: string;
  twitterInfo: TwitterInfo;
  switchInfo?: SwitchInfo;
  gender?: string;
  introductionMessage?: string;
  languages?: string[];
  favoritePlayHours?: [number, number];
};

export type GameInfo = {
  serverRegion?: ServerRegion;
  level?: number;
  anarchyBattleRank?: {
    grade: AnarchyBattleRankGrade;
    point: number;
  };
  salmonRunRank?: {
    grade: SalmonRunRankGrade;
  };
  xMatchInfo?: XMatchInfo; // S+ 이상만
  salmonRunMapPoints: SalmonRunMapPoints; // 전설 이상만
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
      salmonRunInfo: P.optional({
        dent: P.number.gte(0).lte(999),
        highway: P.number.gte(0).lte(999),
        lift: P.number.gte(0).lte(999),
        ship: P.number.gte(0).lte(999),
        spiral: P.number.gte(0).lte(999),
        up: P.number.gte(0).lte(999),
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
      anarchyBattleRank: P.optional({
        grade: P.union(...anarchyBattleRanks),
        point: P.number,
      }),
      salmonRunRank: P.optional({
        grade: P.union(...salmonRunRanks),
      }),
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

export const anarchyBattleRanks = [
  "C-",
  "C",
  "C+",
  "B-",
  "B",
  "B+",
  "A-",
  "A",
  "A+",
  "S",
  "S+",
] as const;

export const isKeyOfXmatch = (
  key: string,
): key is keyof typeof GameCardXMatch =>
  isMatching(P.union("area", "fish", "clam", "tower"), key);

export const salmonRunMapPointKeys = [
  "dent",
  "highway",
  "lift",
  "ship",
  "spiral",
  "up",
] as const;

export const isKeyOfSalmonRunMapPoints = (
  key: string,
): key is keyof SalmonRunMapPoints =>
  isMatching(P.union(...salmonRunMapPointKeys), key);

export type AnarchyBattleRankGrade = (typeof anarchyBattleRanks)[number];

export const isAnarchyBattleRank = (
  rank: string,
): rank is AnarchyBattleRankGrade =>
  anarchyBattleRanks.includes(rank as AnarchyBattleRankGrade);

export const salmonRunRanks = [
  "Grade_00",
  "Grade_01",
  "Grade_02",
  "Grade_03",
  "Grade_04",
  "Grade_05",
  "Grade_06",
  "Grade_07",
  "Grade_08",
] as const;

export type SalmonRunRankGrade = (typeof salmonRunRanks)[number];

export const isSalmonRunRank = (rank: string): rank is SalmonRunRankGrade =>
  salmonRunRanks.includes(rank as SalmonRunRankGrade);

export const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
export type LangCode = (typeof SUPPORT_LABEL_LANGUAGES)[number];

// 임시로 만든 코드 추후 제대로 언어 객체 만들어서 사용 예정
export const salmonRunRanksKo: Record<SalmonRunRankGrade, string> = {
  Grade_00: "\ucd08\ubcf4",
  Grade_01: "\uacac\uc2b5",
  Grade_02: "\uc77c\ubc18",
  Grade_03: "\uc804\ubb38",
  Grade_04: "\ub2ec\uc778",
  Grade_05: "\ub2ec\uc778 +1",
  Grade_06: "\ub2ec\uc778 +2",
  Grade_07: "\ub2ec\uc778 +3",
  Grade_08: "\uc804\uc124",
};

export const salmonrun_legend = "Grade_08";
