import { z } from "zod";

/*
엑스 매치 정보
{
  area: "23+"
  fish: "2503.4"
}
*/

/*
룰별 선호도
{
  area: "🤔" TODO: 좀 더 효율적으로 표현할 수 있을지 고민해보기
  salmonrun: "🤔"
}
*/

export type TwitterInfo = {
  name: string;
  id: string;
};

export type SwitchInfo = {
  name: string;
  inGameName: string;
  friendCode: string;
  friendLink: string;
};

export const PlayTimeObject = z
  .object({
    start: z.number().int().min(0).max(23),
    end: z.number().int().min(0).max(23),
  })
  .optional();

export const UserInfoObject = z.object({
  profileImageUrl: z.string().optional(),
  splatplateImageUrl: z.string().optional(),
  twitterInfo: z.object({
    name: z.string(),
    id: z.string(),
  }),
  switchInfo: z.object({
    name: z.string(),
    inGameName: z.string(),
    friendCode: z.string(),
    friendLink: z.string().optional(),
  }),
  salmonRunInfo: z
    .object({
      dent: z.number().int().min(0).max(999),
      highway: z.number().int().min(0).max(999),
      lift: z.number().int().min(0).max(999),
      ship: z.number().int().min(0).max(999),
      spiral: z.number().int().min(0).max(999),
      up: z.number().int().min(0).max(999),
    })
    .optional(),
  gender: z.string().optional(),
  introductionMessage: z.string().optional(),
  languages: z.array(z.string()).optional(),
  weekdayPlaytime: PlayTimeObject,
  weekendPlaytime: PlayTimeObject,
});

export const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
export type LangCode = (typeof SUPPORT_LABEL_LANGUAGES)[number];

export const CanvasInfoObject = z
  .object({
    drawedImageUrl: z.string().optional(),
    ogImageUrl: z.string().optional(),
  })
  .optional();
