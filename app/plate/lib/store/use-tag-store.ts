"use client";
import lang from "../../lang.json";
import { create } from "zustand";
import { GradientDirection } from "../types/gradient";

import { StateStorage } from "zustand/middleware";
import { Profile } from "@/app/lib/types/supabase-alias";
import { z } from "zod";
import { useEffect } from "react";
import { SplatfileClient } from "@/app/lib/splatfile-client";
import { isPlateInfo } from "@/app/lib/types/type-checker";
import { PlateInfoObject } from "@/app/plate/lib/types/plate-info";
import { Lang } from "@/app/lib/types/component-props";

export type Gradients = [string, string, string, string];

export const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? "";
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

export type TagState = z.infer<typeof PlateInfoObject>;

type TagStore = z.infer<typeof PlateInfoObject> & {
  set: (tag: z.infer<typeof PlateInfoObject>) => void;
};

type Title = {
  first: number;
  firstString?: string;
  last: number;
  lastString?: string;
  string: string;
};

const initTitle = {
  title: {
    first: 0,
    firstString: "100%",
    last: 0,
    lastString: ".52 갤런 유저",
    string: "100% .52 갤런 유저",
  },
};

export const initTagState = (): TagState => ({
  name: "Player",
  title: { ...initTitle.title },
  banner: "Npl_Tutorial00.png",
  layers: 0,
  id: lang["KRko"].sign + "0001",
  badges: ["", "", ""],
  color: "#ffffff",
  bgColours: ["#bbbbbb", "#999999", "#555555", "#222222"],
  isGradient: false,
  isCustom: false,
  gradientDirection: "to bottom",
});

type LoadingStore = {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
};

export const useTagLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));

export const useTagStore = create<TagStore>((set) => ({
  ...initTagState(),

  set: (tag: TagState) =>
    set((state) => ({
      ...state,
      ...tag,
    })),
}));

export const initializeTagStore = (profile: Profile) => {
  const { plate_info } = profile;

  if (!isPlateInfo(plate_info)) {
    console.error("Invalid Plate Info", profile);
    throw new Error(
      "Invalid profile data plateInfo: " + JSON.stringify(plate_info, null, 2),
    );
  }

  useTagStore.setState({
    ...initTagState,
    ...plate_info,
    badges: plate_info.badges.map((p) => {
      const pngIndex = p.indexOf(".png");
      if (pngIndex === -1) {
        return p;
      }
      return p.substring(0, pngIndex);
    }) as [string, string, string],
  });
};

export const setTitle = (title: Partial<Title>) => {
  useTagStore.setState((state) => ({
    ...state,
    title: {
      ...state.title,
      ...title,
    },
  }));
};

export const useTitle = () => {
  return useTagStore((state) => state.title);
};

export const setName = (name: string) => {
  useTagStore.setState((state) => ({
    ...state,
    name,
  }));
};

export const useName = () => {
  return useTagStore((state) => state.name);
};

export const setBanner = (banner: string) => {
  useTagStore.setState((state) => ({
    ...state,
    banner,
    isGradient: false,
  }));
};

export const useBanner = () => {
  return useTagStore((state) => state.banner);
};

export const setBadges = (badges: [string, string, string]) => {
  useTagStore.setState((state) => ({
    ...state,
    badges,
  }));
};

export const useBadges = () => {
  return useTagStore((state) => state.badges);
};

export const setColor = (color: string) => {
  useTagStore.setState((state) => ({
    ...state,
    color,
  }));
};

export const useColor = () => {
  return useTagStore((state) => state.color);
};

export const setId = (id: string) => {
  useTagStore.setState((state) => ({
    ...state,
    id,
  }));
};

export const useId = () => {
  return useTagStore((state) => state.id);
};

export const setLayers = (layers: number) => {
  useTagStore.setState((state) => ({
    ...state,
    layers,
  }));
};

export const setGradient = (bgColours: Gradients) => {
  useTagStore.setState((state) => ({
    ...state,
    bgColours,
    isGradient: true,
  }));
};

export const useGradient = () => {
  return useTagStore((state) => state.bgColours);
};

export const useGradientDirection = () => {
  return useTagStore((state) => state.gradientDirection);
};

export const setGradientDirection = (gradientDirection: GradientDirection) => {
  useTagStore.setState((state) => ({
    ...state,
    gradientDirection,
    isGradient: true,
  }));
};

export const setTagLoading = (isLoading: boolean) => {
  useTagLoadingStore.setState({
    isLoading,
  });
};

export const subscribeEdit = (userId: string, lang: Lang) => {
  let timeoutId: NodeJS.Timeout | string | number | undefined;
  const client = new SplatfileClient("CLIENT_COMPONENT");

  // subscribe은 unsubscribe를 return 하여, useEffect의 cleanup 함수로 사용할 수 있습니다.
  return useTagStore.subscribe((state, prevState) => {
    if (!prevState) return;
    setTagLoading(true);
    const currJson = JSON.stringify(state);
    const prevJson = JSON.stringify(prevState);

    if (!checkValidState(prevJson, currJson)) {
      setTagLoading(false);
      return;
    }

    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const user = await client.supabase.auth.getUser();
      if (userId !== user.data.user?.id) {
        return;
      }
      const { set, ...plate_info } = state;
      await client.updateProfile(
        {
          plate_info,
        },
        userId,
        lang,
      );
      setTagLoading(false);
    }, 2 * 1000);
  });
};

const initStateJson = JSON.stringify(initTagState());

const checkValidState = (prevStateJson: string, currStateJson: string) => {
  return (
    currStateJson !== prevStateJson &&
    currStateJson !== initStateJson &&
    prevStateJson !== initStateJson
  );
};

export const useDebounceTagEdit = (
  userId: string,
  isMine: boolean,
  lang: Lang,
) => {
  useEffect(
    () => (userId ? subscribeEdit(userId, lang) : undefined),
    [userId, isMine, lang],
  );
};
