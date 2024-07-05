"use client";
import {
  SwitchInfo,
  TwitterInfo,
  UserInfoObject,
} from "@/app/lib/schemas/profile";
import {
  AnarchyBattleRankGrade,
  GameInfoObject,
  PlayStyleEnumObject,
  PlayStyleKeysObject,
  RankRule,
  RuleFavorEnum,
  RuleFavorObject,
  salmonrun_legend,
  SalmonRunMapPoints,
  SalmonRunRankGrade,
} from "@/app/lib/schemas/profile/game-info";
import { z } from "zod";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { isGameInfo, isUserInfo } from "@/app/lib/types/type-checker";
import { Profile } from "../types/supabase-alias";

type ProfileState = {
  user: z.infer<typeof UserInfoObject>;
  game: z.infer<typeof GameInfoObject>;
  updatedAt: string;
};

type ProfileStore = {
  set: (state: Partial<ProfileState>) => void;
  setLevel: (level: number) => void;
} & ProfileState;

const initState = (): ProfileState => {
  return {
    user: {
      twitterInfo: {
        name: "",
        id: "",
      },
      switchInfo: {
        name: "",
        inGameName: "",
        friendCode: "",
        friendLink: "",
      },
    },
    game: {
      level: 0,
      salmonRunMapPoints: {
        Shakedent: 40,
        Shakehighway: 40,
        Shakelift: 40,
        Shakeship: 40,
        Shakespiral: 40,
        Shakeup: 40,
        Shakerail: 40,
      },
      playStyle: {
        open: "Newbie",
        regular: "Newbie",
        dropIn: false,
      },
    },
    updatedAt: "",
  };
};

export const useProfileStore = createWithEqualityFn<ProfileStore>(
  (set, get) => ({
    ...initState(),
    set: (state: Partial<ProfileState>) => {
      set({ ...get(), ...state });
    },
    setLevel: (level: number) => {
      set({ game: { ...get().game, level } });
    },
  }),
  shallow,
);

export const initProfileStore = (profile: Profile, isMine: boolean) => {
  const { user_info, game_info, updated_at } = profile;

  if (!isUserInfo(user_info) || !isGameInfo(game_info)) {
    console.error("Invalid profile data", profile);
    throw new Error(
      "Invalid profile data userInfo: " +
        JSON.stringify(user_info, null, 2) +
        " gameInfo: " +
        JSON.stringify(game_info, null, 2),
    );
  }

  useProfileStore.setState((state) => ({
    ...state,
    user: { ...user_info },
    game: { ...game_info, level: game_info.level || 0 },
    updatedAt: updated_at,
  }));
  setMine(isMine);
};

export const useUserStore = () =>
  useProfileStore((state) => state.user, shallow);

export const useSwitchInfo = () =>
  useProfileStore((state) => state.user.switchInfo, shallow);

export const useGameStore = () =>
  useProfileStore((state) => state.game, shallow);

const setUserInfo = (userInfo: Partial<z.infer<typeof UserInfoObject>>) => {
  useProfileStore.setState((state) => ({
    ...state,
    user: { ...state.user, ...userInfo },
  }));
};

export const setGameInfo = (
  gameInfo: Partial<z.infer<typeof GameInfoObject>>,
) => {
  useProfileStore.setState((state) => ({
    ...state,
    game: { ...state.game, ...gameInfo },
  }));
};

export const setLevel = (level: number) => {
  setGameInfo({ level });
};

export const setSwitchInfo = (key: keyof SwitchInfo, value: string) => {
  const switchInfo = useProfileStore.getState().user.switchInfo;

  const qrUrlRegex =
    "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";

  if (key === "friendLink" && !value.match(qrUrlRegex)) {
    console.error("Invalid friend link", value);
  }

  if (key === "friendCode" && !value.match(/\d{4}-\d{4}-\d{4}/)) {
    console.error("Invalid friend code", value);
  }

  setUserInfo({
    switchInfo: {
      ...switchInfo,
      [key]: value,
    },
  });
};

export const useWeaponGearInfo = () =>
  useProfileStore((state) => state.game.weaponGearInfo, shallow);

export const setWeaponGearInfo = (
  weaponGearInfo: z.infer<typeof GameInfoObject>["weaponGearInfo"],
) => {
  useProfileStore.setState((state) => ({
    ...state,
    game: {
      ...state.game,
      weaponGearInfo,
    },
  }));
};

export const setAnarchyBattleRank = (
  rank: AnarchyBattleRankGrade,
  point: number,
) => {
  setGameInfo({
    anarchyBattleRank: {
      grade: rank,
      point,
    },
  });
};

export const setSalmonRunRank = (rank: SalmonRunRankGrade) => {
  const state = useProfileStore.getState();
  if (rank === salmonrun_legend && !state.game.salmonRunMapPoints) {
    setGameInfo({
      salmonRunRank: {
        grade: rank,
      },
      salmonRunMapPoints: {
        Shakedent: 40,
        Shakehighway: 40,
        Shakelift: 40,
        Shakeship: 40,
        Shakespiral: 40,
        Shakeup: 40,
        Shakerail: 40,
      },
    });
    return;
  }
  setGameInfo({
    salmonRunRank: {
      grade: rank,
    },
  });
};

export const useSalmonRunMapPoints = () =>
  useProfileStore((state) => state.game.salmonRunMapPoints, shallow);

export const useSalmonRunRank = () =>
  useProfileStore((state) => state.game.salmonRunRank, shallow);

export const useTwitterInfo = () =>
  useProfileStore((state) => state.user.twitterInfo, shallow);

export const useGender = () => useProfileStore((state) => state.user.gender);

export const setGender = (gender: string) => setUserInfo({ gender });

export const useIntroductionMessage = () =>
  useProfileStore((state) => state.user.introductionMessage, shallow);

export const setIntroductionMessage = (introductionMessage: string) => {
  setUserInfo({ introductionMessage });
};

export const useProfileImageUrl = () =>
  useProfileStore((state) => state.user.profileImageUrl, shallow);

export const setProfileImageUrl = (profileImageUrl: string) => {
  setUserInfo({ profileImageUrl });
};

export const setPlaytime = (
  timeType: "weekdayPlaytime" | "weekendPlaytime",
  playtime: Partial<{
    start: number;
    end: number;
  }>,
) => {
  setUserInfo({
    [timeType]: {
      ...useProfileStore.getState().user[timeType],
      ...playtime,
    },
  });
};

export const initProfileStateJson = JSON.stringify(initState());

export const getUpdatedAt = () => {
  return useProfileStore.getState().updatedAt;
};

type EditStore = {
  isMine: boolean;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export const useEditStore = createWithEqualityFn<EditStore>(
  (set) => ({
    isMine: false,
    isLoading: false,

    setLoading: (isLoading: boolean) => set({ isLoading }),
  }),
  shallow,
);

export const setLoading = (isLoading: boolean) => {
  useEditStore.setState((state) => ({ ...state, isLoading }));
};

export const setMine = (isMine: boolean) => {
  useEditStore.setState((state) => ({
    ...state,
    isMine,
    isLoading: isMine ? state.isLoading : false,
  }));
};

export const setXMatchPoint = (
  key: keyof Lowercase<RankRule>,
  value: string,
) => {
  useProfileStore.setState((state) => ({
    ...state,
    game: {
      ...state.game,
      xMatchInfo: {
        ...state.game.xMatchInfo,
        [key]: value,
      },
    },
  }));
};

export const setRuleFavor = (
  key: keyof z.infer<typeof RuleFavorObject>,
  value: z.infer<typeof RuleFavorEnum>,
) => {
  useProfileStore.setState((state) => ({
    ...state,
    game: {
      ...state.game,
      ruleFavor: {
        ...state.game.ruleFavor,
        [key]: value,
      },
    },
  }));
};

export const setTwitterInfo = (key: keyof TwitterInfo, value: string) => {
  const twitterInfo = useProfileStore.getState().user.twitterInfo;
  setUserInfo({
    twitterInfo: {
      ...twitterInfo,
      [key]: value,
    },
  });
};

export const setSalmonRunMapPoints = (
  key: keyof SalmonRunMapPoints,
  value: number,
) => {
  const state = useProfileStore.getState();

  setGameInfo({
    ...state.game,
    salmonRunMapPoints: {
      ...state.game.salmonRunMapPoints,
      [key]: value,
    },
  });
};

export const useRuleFavor = () =>
  useProfileStore((state) => state.game.ruleFavor);

export const usePlayStyle = () =>
  useProfileStore((state) => state.game.playStyle);

export const setPlayStyle = (
  key: z.infer<typeof PlayStyleKeysObject>,
  value: z.infer<typeof PlayStyleEnumObject>,
) => {
  setGameInfo({
    playStyle: {
      ...useProfileStore.getState().game.playStyle,
      [key]: value,
    },
  });
};

export const setPlayStyleDropIn = (value: boolean) => {
  setGameInfo({
    playStyle: {
      ...useProfileStore.getState().game.playStyle,
      dropIn: value,
    },
  });
};

//
// export type UserInfo = {
//   nickname: string;
//   profileImageUrl?: string;
//   splatplateImageUrl?: string;
//   twitterInfo?: TwitterInfo;
//   switchInfo?: SwitchInfo;
//   gender?: string;
//   introductionMessage?: string;
//   languages?: string[];
//   favoritePlayHours?: [number, number];
// };
//
// export type GameInfo = {
//   serverRegion?: ServerRegion;
//   level?: number;
//   anarchyBattleRank?: string;
//   salmonRunRank?: string;
//   xMatchInfo?: XMatchInfo;
//   ruleFavoriteInfo?: RuleFavoriteInfo;
//   playStyle?: PlayStyle;
// };
//
// export type WeaponGearInfo = {
//   mainWeapon: MainWeaponCode;
//   subWeapon: SubWeaponCode;
//   specialWeapon: SpecialWeaponCode;
//   gearPowers: {
//     head: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
//     body: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
//     shoes: [GearPowerCode, GearPowerCode, GearPowerCode, GearPowerCode];
//   };
//   rules: Rule[];
// }; // 무기와 기어 정보
//
// type TwitterInfo = {
//   name: string;
//   id: string;
// };
//
// type SwitchInfo = {
//   name: string;
//   inGameName?: string;
//   friendCode?: string;
//   friendLink?: string;
// };
