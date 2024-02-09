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
  name?: string;
  id?: string;
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

export const UserInfoObject = z.object({
  nickname: z.string(),
  profileImageUrl: z.string().optional(),
  splatplateImageUrl: z.string().optional(),
  twitterInfo: z
    .object({
      name: z.string().optional(),
      id: z.string().optional(),
    })
    .optional(),
  switchInfo: z
    .object({
      name: z.string().optional(),
      inGameName: z.string().optional(),
      friendCode: z.string().optional(),
      friendLink: z.string().optional(),
    })
    .optional(),
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
  favoritePlayHours: z.array(z.number().int()).optional(),
  weekdayPlayTime: z
    .object({
      start: z.number().int().min(0).max(24),
      end: z.number().int().min(24).max(48),
    })
    .optional(),
  weekendPlayTime: z
    .object({
      start: z.number().int().min(0).max(24),
      end: z.number().int().min(24).max(48),
    })
    .optional(),
});

export const isUserInfo = (
  data: unknown,
): data is z.infer<typeof UserInfoObject> => {
  const result = UserInfoObject.safeParse(data);
  if (!result.success) console.error(result.error);
  return result.success;
};

export const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
export type LangCode = (typeof SUPPORT_LABEL_LANGUAGES)[number];
