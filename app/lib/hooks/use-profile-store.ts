import { GameInfo, UserInfo } from "@/app/lib/schemas/profile";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";
import { createWithEqualityFn } from "zustand/traditional";

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
    game: {},
    set: (state: Partial<ProfileState>) => {
      set({ ...get(), ...state });
    },
  }),
  shallow,
);

export const useUserStore = () => useProfileStore((state) => state.user);

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

// State가 변경될 때마다, 2초 뒤에 supabase에 저장하는 로직을 실행합니다.
export const useDebounceEdit = (userId: string, isMine: boolean) => {
  useEffect(
    () => (isMine ? subscribeEdit(userId) : undefined),
    [userId, isMine],
  );
};

export const subscribeEdit = (userId: string) => {
  let timeoutId: NodeJS.Timeout | string | number | undefined;
  // subscribe은 unsubscribe를 return 하여, useEffect의 cleanup 함수로 사용할 수 있습니다.
  return useProfileStore.subscribe((state, prevState) => {
    const currJson = JSON.stringify(state);
    const prevJson = JSON.stringify(prevState);
    if (currJson === prevJson) return;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setLoading(true);
      // TODO: supabase에 저장하는 로직
      setLoading(false);
    }, 2 * 1000);
  });
};

type LoadingStore = {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export const useLoadingStore = createWithEqualityFn<LoadingStore>(
  (set) => ({
    isLoading: false,
    setLoading: (isLoading: boolean) => set({ isLoading }),
  }),
  shallow,
);

const setLoading = (isLoading: boolean) => {
  useLoadingStore.setState((state) => ({ ...state, isLoading }));
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
