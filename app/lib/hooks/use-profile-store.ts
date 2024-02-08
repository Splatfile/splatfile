import {
  AnarchyBattleRankGrade,
  GameInfo,
  isGameInfo,
  isUserInfo,
  RankRule,
  salmonrun_legend,
  SalmonRunMapPoints,
  SalmonRunRankGrade,
  SwitchInfo,
  TwitterInfo,
  UserInfo,
} from "@/app/lib/schemas/profile";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { createWithEqualityFn } from "zustand/traditional";
import { Profile } from "@/app/lib/types/supabase-alias";
import { createSupabaseClient, updateProfile } from "@/app/lib/supabase-client";

type ProfileState = {
  user: UserInfo;
  game: GameInfo;
};

type ProfileStore = {
  set: (state: Partial<ProfileState>) => void;
} & ProfileState;

const useProfileStore = createWithEqualityFn<ProfileStore>(
  (set, get) => ({
    user: {
      nickname: "",
      twitterInfo: {
        name: "",
        id: "",
      },
    },
    game: {
      salmonRunMapPoints: {
        dent: 40,
        highway: 40,
        lift: 40,
        ship: 40,
        spiral: 40,
        up: 40,
      },
    },
    set: (state: Partial<ProfileState>) => {
      set({ ...get(), ...state });
    },
  }),
  shallow,
);

export const initProfileStore = (profile: Profile, isMine: boolean) => {
  const { user_info, game_info } = profile;

  if (!isUserInfo(user_info) || !isGameInfo(game_info)) {
    console.error("Invalid profile data", profile);
    throw new Error(
      "Invalid profile data userInfo: " + user_info + " gameInfo: " + game_info,
    );
  }

  useProfileStore.setState((state) => ({
    user: user_info,
    game: game_info,
  }));
  setMine(isMine);
};

export const useUserStore = () => useProfileStore((state) => state.user);

export const useSwitchInfo = () =>
  useProfileStore((state) => state.user.switchInfo);

export const useGameStore = () => useProfileStore((state) => state.game);

export const setUserInfo = (userInfo: Partial<UserInfo>) => {
  useProfileStore.setState((state) => ({
    ...state,
    user: { ...state.user, ...userInfo },
  }));
};

export const setGameInfo = (gameInfo: Partial<GameInfo>) => {
  useProfileStore.setState((state) => ({
    ...state,
    game: { ...state.game, ...gameInfo },
  }));
};

export const setNickname = (nickname: string) => {
  setUserInfo({ nickname });
};

export const setLevel = (level: number) => {
  setGameInfo({ level });
};

export const setSwitchInfo = (key: keyof SwitchInfo, value: string) => {
  const switchInfo = useProfileStore.getState().user.switchInfo;
  setUserInfo({
    switchInfo: {
      ...switchInfo,
      [key]: value,
    },
  });
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
        dent: 40,
        highway: 40,
        lift: 40,
        ship: 40,
        spiral: 40,
        up: 40,
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
  useProfileStore((state) => state.game.salmonRunMapPoints);

export const useSalmonRunRank = () =>
  useProfileStore((state) => state.game.salmonRunRank);

export const useTwitterInfo = () =>
  useProfileStore((state) => state.user.twitterInfo);

export const useGender = () => useProfileStore((state) => state.user.gender);

export const setGender = (gender: string) => {
  setUserInfo({ gender });
};

// State가 변경될 때마다, 2초 뒤에 supabase에 저장하는 로직을 실행합니다.
export const useDebounceEdit = (userId: string, isMine: boolean) => {
  useEffect(
    () => (isMine ? subscribeEdit(userId) : undefined),
    [userId, isMine],
  );
};

export const subscribeEdit = (userId: string) => {
  let timeoutId: NodeJS.Timeout | string | number | undefined;
  const supabase = createSupabaseClient("CLIENT_COMPONENT");

  // subscribe은 unsubscribe를 return 하여, useEffect의 cleanup 함수로 사용할 수 있습니다.
  return useProfileStore.subscribe((state, prevState) => {
    if (!prevState) return;

    const currJson = JSON.stringify(state);
    const prevJson = JSON.stringify(prevState);

    if (currJson === prevJson) return;
    setLoading(true);
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const user = await supabase.auth.getUser();
      if (userId !== user.data.user?.id) {
        setLoading(false);
        return;
      }
      await updateProfile(
        supabase,
        {
          user_info: state.user,
          game_info: state.game,
        },
        userId,
      );
      setLoading(false);
    }, 2 * 1000);
  });
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

const setLoading = (isLoading: boolean) => {
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

export const setTwitterInfo = (key: keyof TwitterInfo, value: string) => {
  const twitterInfo = useProfileStore.getState().user.twitterInfo;
  setUserInfo({
    twitterInfo: {
      ...twitterInfo,
      [key]: value,
    },
  });
};

export const useMine = () => {
  return useEditStore((state) => state.isMine);
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
