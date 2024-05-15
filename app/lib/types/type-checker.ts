import { z } from "zod";
import { UserInfoObject } from "@/app/lib/schemas/profile";
import { GameInfoObject } from "@/app/lib/schemas/profile/game-info";
import { PlateInfoObject } from "@/app/plate/lib/types/plate-info";

export function isPlateInfo(
  obj: unknown,
): obj is z.infer<typeof PlateInfoObject> {
  const parsed = PlateInfoObject.safeParse(obj);
  if (!parsed.success) {
    throw parsed.error;
  }
  return parsed.success;
}

export const isUserInfo = (
  data: unknown,
): data is z.infer<typeof UserInfoObject> => {
  const result = UserInfoObject.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.success;
};
export const isGameInfo = (
  data: unknown,
): data is z.infer<typeof GameInfoObject> => {
  const result = GameInfoObject.safeParse(data);
  if (!result.success) {
    console.error(result.error);
  }
  return result.success;
};
