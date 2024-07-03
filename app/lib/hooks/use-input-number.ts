import { useEffect } from "react";

export const useInputNumber = (
  uiNumber: number | string,
  setUiNumber: (uiNumber: number | string) => void,
  storeNumber: number,
  setStoreNumber: (number: number) => void,
) => {
  useEffect(() => {
    if (!uiNumber) {
      return;
    }

    if (typeof uiNumber === "string") {
      const parsed = parseInt(uiNumber);
      if (isNaN(parsed)) {
        return;
      }
      setStoreNumber(parsed);
      return;
    }

    setStoreNumber(uiNumber);
  }, [uiNumber]);

  useEffect(() => {
    if (!storeNumber) {
      setUiNumber(0);
      return;
    }

    setUiNumber(storeNumber);
  }, [storeNumber]);

  useEffect(
    () => () => {
      setUiNumber(0);
      setStoreNumber(0);
    },
    [],
  );
};
