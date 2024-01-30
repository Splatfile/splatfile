export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const matchRanks = [
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
  "GRADE_00",
  "GRADE_01",
  "GRADE_02",
  "GRADE_03",
  "GRADE_04",
  "GRADE_05",
  "GRADE_06",
  "GRADE_07",
  "GRADE_08",
] as const;

export const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
export type LangCode = (typeof SUPPORT_LABEL_LANGUAGES)[number];

export const salmonRunRanksKo = {
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

// 연어런 등급 코드 한국어
//  "CommonMsg/Coop/CoopGrade": {
//     "Grade_00": "\ucd08\ubcf4",
//     "Grade_01": "\uacac\uc2b5",
//     "Grade_02": "\uc77c\ubc18",
//     "Grade_03": "\uc804\ubb38",
//     "Grade_04": "\ub2ec\uc778",
//     "Grade_05": "\ub2ec\uc778 +1",
//     "Grade_06": "\ub2ec\uc778 +2",
//     "Grade_07": "\ub2ec\uc778 +3",
//     "Grade_08": "\uc804\uc124",
//     "Grade_Arbeiter_00": "\ucd08\ubcf4 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd",
//     "Grade_Arbeiter_01": "\uacac\uc2b5 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd",
//     "Grade_Arbeiter_02": "\uc77c\ubc18 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd",
//     "Grade_Arbeiter_03": "\uc804\ubb38 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd",
//     "Grade_Arbeiter_04": "\ub2ec\uc778 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd",
//     "Grade_Arbeiter_05": "\ub2ec\uc778 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd +1",
//     "Grade_Arbeiter_06": "\ub2ec\uc778 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd +2",
//     "Grade_Arbeiter_07": "\ub2ec\uc778 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd +3",
//     "Grade_Arbeiter_08": "\uc804\uc124\uc758 \uc544\ub974\ubc14\uc774\ud2b8\uc0dd"
//   },
