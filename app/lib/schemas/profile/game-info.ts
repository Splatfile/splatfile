import { battleCodes, salmonrunCodes } from "@/app/lib/constants/maps";
import {
  mainsCodes,
  specialsCodes,
  subsCodes,
} from "@/app/lib/constants/weapons";
import { gearPowerCodes } from "@/app/lib/constants/weapons/etc";
import { GameCardXMatch } from "@/app/users/[userId]/profile/components/game-information/GameCardXMatch";
import { isMatching, P } from "ts-pattern";
import { z } from "zod";

type ServerRegion = "KR/HK" | "JP" | "EU" | "NA/SA/AT/NC";
export type RankRule = "Area" | "Fish" | "Clam" | "Tower";
type Rule = RankRule | "Regular" | "SalmonRun";
export type XMatchInfo = {
  [K in RankRule as Lowercase<K>]?: string;
};
export type SalmonRunMapPoints = {
  [K in SalmonRunMapCode]: number;
};
type RuleFavoriteInfo = {
  [K in Rule as Lowercase<K>]?: string;
};
type PlayStyle = "Newbie" | "Gachi" | "Casual"; // 뉴비 / 진심 (일본어로 Gachi) / 캐주얼
type MainWeaponCode = (typeof mainsCodes)[number];
type SubWeaponCode = (typeof subsCodes)[number];
type SpecialWeaponCode = (typeof specialsCodes)[number];
type GearPowerCode = (typeof gearPowerCodes)[number];
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
export const GameInfoObject = z.object({
  serverRegion: z.string().optional(),
  level: z.number().optional(),
  anarchyBattleRank: z
    .object({
      grade: z.enum(anarchyBattleRanks),
      point: z.number(),
    })
    .optional(),
  salmonRunRank: z
    .object({
      grade: z.enum(salmonRunRanks).optional(),
    })
    .optional(),
  salmonRunMapPoints: z.object({
    Shakedent: z.number(),
    Shakehighway: z.number(),
    Shakelift: z.number(),
    Shakeship: z.number(),
    Shakespiral: z.number(),
    Shakeup: z.number(),
    Shakerail: z.number(),
  }),
  xMatchInfo: z
    .object({
      area: z.string().optional(),
      fish: z.string().optional(),
      clam: z.string().optional(),
      tower: z.string().optional(),
    })
    .optional(),
  ruleFavoriteInfo: z
    .object({
      area: z.string().optional(),
      salmonrun: z.string().optional(),
    })
    .optional(),
  playStyle: z.string().optional(),
  weaponGearInfo: z
    .record(
      z.object({
        isActivated: z.boolean(),
        mainWeapon: z.string(),
        subWeapon: z.string(),
        specialWeapon: z.string(),
        gearPowers: z.object({
          head: z.tuple([z.string(), z.string(), z.string(), z.string()]),
          body: z.tuple([z.string(), z.string(), z.string(), z.string()]),
          shoes: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        }),
        rules: z.array(z.string()),
      }),
    )
    .optional(),
});
export const isGameInfo = (
  data: unknown,
): data is z.infer<typeof GameInfoObject> => {
  const result = GameInfoObject.safeParse(data);
  if (!result.success) console.error(result.error);
  return result.success;
};
export const isKeyOfXmatch = (
  key: string,
): key is keyof typeof GameCardXMatch =>
  isMatching(P.union("area", "fish", "clam", "tower"), key);

export const isKeyOfSalmonRunMapPoints = (
  key: string,
): key is keyof SalmonRunMapPoints =>
  isMatching(P.union(...salmonrunCodes), key);
export type AnarchyBattleRankGrade = (typeof anarchyBattleRanks)[number];
export const isAnarchyBattleRank = (
  rank: string,
): rank is AnarchyBattleRankGrade =>
  anarchyBattleRanks.includes(rank as AnarchyBattleRankGrade);
export type SalmonRunRankGrade = (typeof salmonRunRanks)[number];
export const isSalmonRunRank = (rank: string): rank is SalmonRunRankGrade =>
  salmonRunRanks.includes(rank as SalmonRunRankGrade);
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
type BattleMapCode = (typeof battleCodes)[number];
type SalmonRunMapCode = (typeof salmonrunCodes)[number];
