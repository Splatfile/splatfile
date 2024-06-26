import { z } from "zod";
import { UserInfoObject } from "@/app/lib/schemas/profile";
import { GameInfoObject } from "@/app/lib/schemas/profile/game-info";
import { PlateInfoObject } from "@/app/plate/lib/types/plate-info";

export type PlateInfo = z.infer<typeof PlateInfoObject>;
export type UserInfo = z.infer<typeof UserInfoObject>;
export type GameInfo = z.infer<typeof GameInfoObject>;

export function isPlateInfo(obj: unknown): obj is PlateInfo {
  const parsed = PlateInfoObject.safeParse(obj);
  if (!parsed.success) {
    throw parsed.error;
  }
  return parsed.success;
}

export const isUserInfo = (data: unknown): data is UserInfo => {
  const result = UserInfoObject.safeParse(data);
  if (!result.success) {
    console.error(result.error);
    throw result.error;
  }
  return result.success;
};
export const isGameInfo = (data: unknown): data is GameInfo => {
  const result = GameInfoObject.safeParse(data);
  if (!result.success) {
    console.error(result.error);
    throw result.error;
  }
  return result.success;
};
