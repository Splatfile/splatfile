import { battleCodes, salmonrunCodes } from "@/app/lib/constants/maps";
import {
  mainsCodes,
  specialsCodes,
  subsCodes,
} from "@/app/lib/constants/weapons";
import { gearPowerCodes } from "@/app/lib/constants/weapons/etc";
import { GameCardXMatch } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardXMatch";
import { isMatching, P } from "ts-pattern";
import { z } from "zod";
import { Lang } from "@/app/lib/types/component-props";

type ServerRegion = "KR/HK" | "JP" | "EU" | "NA/SA/AT/NC";
export type RankRule = "Area" | "Fish" | "Clam" | "Tower";
type Rule = RankRule | "Regular" | "SalmonRun";
export type XMatchInfo = {
  [K in RankRule as Lowercase<K>]?: string;
};
export type SalmonRunMapPoints = {
  [K in SalmonRunMapCode]: number;
};

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

export const ruleFavors = [
  "love",
  "like",
  "normal",
  "dislike",
  "hate",
] as const;
export const ruleFavorRules = [
  "salmon" as const,
  "regular" as const,
  "area" as const,
  "fish" as const,
  "clam" as const,
  "tower" as const,
] as const;

export const RuleFavorEnum = z.enum(ruleFavors).optional();
export const RuleFavorObject = z
  .object({
    regular: RuleFavorEnum,
    salmon: RuleFavorEnum,
    area: RuleFavorEnum,
    fish: RuleFavorEnum,
    clam: RuleFavorEnum,
    tower: RuleFavorEnum,
  })
  .optional();

export const NEWBIE = "Newbie" as const;
export const GACHI = "Gachi" as const;
export const CASUAL = "Casual" as const;

export const playStyleKeys = ["open", "regular"] as const;

export const PlayStyleKeysObject = z.enum(playStyleKeys);

export const playStyleEnum = [NEWBIE, GACHI, CASUAL] as const;
export const PlayStyleEnumObject = z.enum(playStyleEnum).optional();

export const DropInObject = z.boolean().optional();

export const PlayStyleObject = z
  .object({
    open: PlayStyleEnumObject,
    regular: PlayStyleEnumObject,
    dropIn: DropInObject,
  })
  .optional();

export const AnarchyBattleRankObject = z
  .object({
    grade: z.enum(anarchyBattleRanks),
    point: z.number(),
  })
  .optional();

export const XMatchInfoObject = z
  .object({
    area: z.string().optional(),
    fish: z.string().optional(),
    clam: z.string().optional(),
    tower: z.string().optional(),
  })
  .optional();
export const WeaponGearInfoObject = z
  .record(
    z.object({
      isActivated: z.boolean(),
      mainWeapon: z.string(),
      subWeapon: z.string(),
      specialWeapon: z.string(),
      selectedTime: z.number().optional(),
      gearPowers: z.object({
        head: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        body: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        shoes: z.tuple([z.string(), z.string(), z.string(), z.string()]),
      }),
      rules: z.array(z.string()),
    }),
  )
  .optional();

export const GameInfoObject = z.object({
  serverRegion: z.string().optional(),
  level: z.number().optional().nullable(),
  anarchyBattleRank: AnarchyBattleRankObject,
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
  xMatchInfo: XMatchInfoObject,
  ruleFavor: RuleFavorObject,
  playStyle: PlayStyleObject,
  weaponGearInfo: WeaponGearInfoObject,
});

export const isKeyOfXmatch = (
  key: string,
): key is keyof typeof GameCardXMatch =>
  isMatching(P.union("area", "fish", "clam", "tower"), key);

export const isKeyOfRuleFavor = (
  key: string,
): key is keyof z.infer<typeof RuleFavorObject> =>
  isMatching(P.union(...ruleFavorRules), key);

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
const salmonRunRanksKo: Record<SalmonRunRankGrade, string> = {
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

const salmonRunRanksEn: Record<SalmonRunRankGrade, string> = {
  Grade_00: "Apprentice",
  Grade_01: "Part-Timer",
  Grade_02: "Go-Getter",
  Grade_03: "Overachiever",
  Grade_04: "Profreshional",
  Grade_05: "Profreshional +1",
  Grade_06: "Profreshional +2",
  Grade_07: "Profreshional +3",
  Grade_08: "Eggsecutive VP",
};
const salmonRunRanksJa: Record<SalmonRunRankGrade, string> = {
  Grade_00: "\u304b\u3051\u3060\u3057",
  Grade_01: "\u306f\u3093\u306b\u3093\u307e\u3048",
  Grade_02: "\u3044\u3061\u306b\u3093\u307e\u3048",
  Grade_03: "\u3058\u3085\u304f\u308c\u3093",
  Grade_04: "\u305f\u3064\u3058\u3093",
  Grade_05: "\u305f\u3064\u3058\u3093\uff0b\uff11",
  Grade_06: "\u305f\u3064\u3058\u3093\uff0b\uff12",
  Grade_07: "\u305f\u3064\u3058\u3093\uff0b\uff13",
  Grade_08: "\u3067\u3093\u305b\u3064",
};

export const getSalmonRunRank = (lang: Lang, rank: SalmonRunRankGrade) => {
  switch (lang) {
    case "ko":
      return salmonRunRanksKo[rank];
    case "en":
      return salmonRunRanksEn[rank];
    case "ja":
      return salmonRunRanksJa[rank];
    default:
      return salmonRunRanksEn[rank];
  }
};

export const salmonrun_legend = "Grade_08";
type BattleMapCode = (typeof battleCodes)[number];
type SalmonRunMapCode = (typeof salmonrunCodes)[number];
