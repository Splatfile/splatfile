import { create } from "zustand";

type ErrorToastStore = {
  error: string;
  setError: (error: string) => void;
};

export const useErrorToastStore = create<ErrorToastStore>((set) => ({
  error: "",
  setError: (error: string) => set({ error }),
}));

export const setErrorMessage = (error: string) => {
  useErrorToastStore.setState({ error });
};
