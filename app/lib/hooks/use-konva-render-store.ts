import { create } from "zustand";

type KonvaRenderStore = {
  loadingTaskToIsCompleted: Record<string, boolean>;
  renderedDataUrl: string | null;
  renderStartTime: Date;

  getFullyLoaded: () => boolean;
  setLoadingTask: (taskKey: string, isCompleted: boolean) => void;
  setRenderedDataUrl: (dataUrl: string) => void;
};

export const useKonvaRenderStore = create<KonvaRenderStore>((set, get) => ({
  loadingTaskToIsCompleted: {
    font: false,
    plateRendering: false,
    background: false,
    profileImage: false,
  },
  renderedDataUrl: null,
  renderStartTime: new Date(),

  getFullyLoaded: () => {
    const isLoadingCompletedList = Object.values(
      get().loadingTaskToIsCompleted,
    );
    return (
      !isLoadingCompletedList.includes(false) &&
      get().renderStartTime.getTime() + 500 < new Date().getTime()
    );
  },
  setLoadingTask: (taskKey, isCompleted) =>
    set((state) => {
      return {
        loadingTaskToIsCompleted: {
          ...state.loadingTaskToIsCompleted,
          [taskKey]: isCompleted,
        },
      };
    }),
  setRenderedDataUrl: (dataUrl) => set({ renderedDataUrl: dataUrl }),
}));
