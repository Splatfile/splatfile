import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { hashStorage } from "./use-tag-store";

type FontRect = {
  x: number;
  y: number;
  fontSize: number;
};

type Rect = {
  x: number;
  y: number;
  size: number;
};

type TagPositionState = {
  tagSize: {
    w: number;
    h: number;
  };
  titlePosition: FontRect;
  namePosition: FontRect;
  badgesPosition: Rect;
  idPosition: FontRect;
  printPreview?: boolean;
};

type TagPositionStore = TagPositionState & {
  set: (tag: TagPositionState) => void;
};

export const initTagPositionState: TagPositionState = {
  tagSize: {
    w: 700,
    h: 200,
  },
  titlePosition: {
    x: 0,
    y: 0,
    fontSize: 36,
  },
  namePosition: {
    x: 0,
    y: 0,
    fontSize: 66,
  },
  badgesPosition: {
    x: 0,
    y: 0,
    size: 0,
  },
  idPosition: {
    x: 0,
    y: 0,
    fontSize: 24,
  },
  printPreview: false,
};

export const printTagPosition: TagPositionState = {
  tagSize: {
    w: 740,
    h: 240,
  },
  titlePosition: {
    x: 12,
    y: -5,
    fontSize: 36,
  },
  namePosition: {
    x: 0,
    y: -4,
    fontSize: 70,
  },
  badgesPosition: {
    x: -14,
    y: 4,
    size: -5,
  },
  idPosition: {
    x: 6,
    y: 0,
    fontSize: 24,
  },
  printPreview: false,
};

export const useTagPositionStore = create<
  TagPositionStore,
  [["zustand/persist", TagPositionStore]]
>(
  persist(
    (set) => ({
      ...initTagPositionState,
      set: (tag: TagPositionState) =>
        set((state) => ({
          ...state,
          ...tag,
        })),
    }),
    {
      name: "tag-position",
      storage: createJSONStorage(() => hashStorage),
    },
  ),
);

export const useTagPosition = () => {
  const tagSize = useTagPositionStore((state) => state.tagSize);
  const titlePosition = useTagPositionStore((state) => state.titlePosition);
  const namePosition = useTagPositionStore((state) => state.namePosition);
  const badgesPosition = useTagPositionStore((state) => state.badgesPosition);
  const idPosition = useTagPositionStore((state) => state.idPosition);
  const printPreview = useTagPositionStore((state) => state.printPreview);

  return {
    tagSize,
    titlePosition,
    namePosition,
    badgesPosition,
    idPosition,
    printPreview,
  };
};

export const useTagSize = () => useTagPositionStore((state) => state.tagSize);

export const setTagSize = (tagSize: TagPositionState["tagSize"]) => {
  const { w, h } = tagSize;

  useTagPositionStore.setState((state) => ({
    ...state,
    tagSize: {
      w,
      h,
    },
  }));
};

export const getTagSize = () => {
  const tagSize = useTagPositionStore.getState().tagSize;
  const { w, h } = tagSize;
  const width = w < 600 ? 600 : w > 800 ? 800 : w;
  const height = h < 150 ? 150 : h > 250 ? 250 : h;

  return {
    w: width,
    h: height,
  };
};

export const useTitlePosition = () => {
  return useTagPositionStore((state) => state.titlePosition);
};

export const setTitlePosition = (
  titlePosition: TagPositionState["titlePosition"],
) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    titlePosition,
  }));
};

export const getTitlePosition = () => {
  return useTagPositionStore.getState().titlePosition;
};

export const useNamePosition = () => {
  return useTagPositionStore((state) => state.namePosition);
};

export const useBadgesPosition = () => {
  return useTagPositionStore((state) => state.badgesPosition);
};

export const setNamePosition = (
  namePosition: TagPositionState["namePosition"],
) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    namePosition,
  }));
};

export const getNamePosition = () => {
  return useTagPositionStore.getState().namePosition;
};

export const setBadgesPosition = (
  badgesPosition: TagPositionState["badgesPosition"],
) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    badgesPosition,
  }));
};

export const getBadgesPosition = () => {
  return useTagPositionStore.getState().badgesPosition;
};

export const useIdPosition = () => {
  return useTagPositionStore((state) => state.idPosition);
};

export const setIdPosition = (idPosition: TagPositionState["idPosition"]) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    idPosition,
  }));
};

export const getIdPosition = () => {
  return useTagPositionStore.getState().idPosition;
};
export const setTagPosition = (tagPosition: TagPositionState) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    ...tagPosition,
  }));
};

export const resetTagPosition = () => {
  useTagPositionStore.setState((state) => ({
    ...state,
    ...initTagPositionState,
  }));
};

export const setPrintTagPosition = () => {
  useTagPositionStore.setState((state) => ({
    ...state,
    ...printTagPosition,
  }));
};

export const useTagPositionState = () => useTagPositionStore.getState();

export const setPrintPreview = (printPreview: boolean) => {
  useTagPositionStore.setState((state) => ({
    ...state,
    printPreview,
  }));
};

export const usePrintPreview = () => {
  return useTagPositionStore((state) => state.printPreview);
};

export const getPrintPreview = () => {
  return useTagPositionStore.getState().printPreview;
};
