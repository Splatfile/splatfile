"use client";
// Canvas 의존성을 없애기 위해 분리 (Konva)
// State가 변경될 때마다, 2초 뒤에 supabase에 저장하는 로직을 실행합니다.
import { setErrorMessage } from "@/app/lib/hooks/use-error-toast-store";
import {
  initProfileStateJson,
  setLoading,
  useProfileStore,
} from "./use-profile-store";
import { getLocaleByLang } from "@/app/lib/use-locale";
import { SplatfileClient } from "../splatfile-client";
import { ErrLocale } from "../locales/locale";
import { Lang } from "../types/component-props";
import { useEffect, useRef } from "react";
import { isPlateInfo } from "@/app/lib/types/type-checker";
import { renderOgProfileImage } from "@/app/konva/lib/render/og";

export const useDebounceEdit = (
  userId: string,
  isMine: boolean,
  err: ErrLocale,
  lang: Lang,
) => {
  const timeoutIdRef: React.MutableRefObject<
    NodeJS.Timeout | string | number | undefined
  > = useRef<NodeJS.Timeout | string | number | undefined>();
  useEffect(
    () => (isMine ? subscribeEdit(userId, timeoutIdRef, err, lang) : undefined),
    [userId, isMine, err, lang],
  );
};

export const subscribeEdit = (
  userId: string,
  timeoutIdRef: React.MutableRefObject<
    NodeJS.Timeout | string | number | undefined
  >,
  err: ErrLocale,
  lang: Lang,
) => {
  const client = new SplatfileClient("CLIENT_COMPONENT");

  // subscribe은 unsubscribe를 return 하여, useEffect의 cleanup 함수로 사용할 수 있습니다.
  return useProfileStore.subscribe((state, prevState) => {
    if (!prevState) return;

    setLoading(true);
    clearTimeout(timeoutIdRef.current);

    timeoutIdRef.current = setTimeout(async () => {
      const user = await client.supabase.auth.getUser();
      if (userId !== user.data.user?.id) {
        setLoading(false);
        return;
      }

      const currJson = JSON.stringify(state, (key, value) => {
        if (key === "updatedAt") {
          return undefined;
        }
        return value;
      });
      const prevJson = JSON.stringify(prevState, (key, value) => {
        if (key === "updatedAt") {
          return undefined;
        }
        return value;
      });

      if (!checkValidState(prevJson, currJson)) {
        setLoading(false);
        return;
      }

      const { plate_info, updated_at } = await client.updateProfile(
        {
          user_info: state.user,
          game_info: state.game,
          updated_at: state.updatedAt,
        },
        userId,
      );
      try {
        if (!isPlateInfo(plate_info)) {
          console.error("Invalid plate info", plate_info);
          setErrorMessage(err.refresh_please);
          setLoading(false);
          return;
        }

        // og rendering
        // 임시 div 생성
        document.getElementById("temp-og-rendering")?.remove();
        const div = document.createElement("div");
        div.className = "hidden";
        div.id = "temp-og-rendering";
        document.body.appendChild(div);

        const ogProfileBlob = await renderOgProfileImage(
          div.id,
          state.user,
          state.game,
          plate_info,
          getLocaleByLang(lang),
          "blob",
        );

        console.log("updated_at", updated_at);

        if (!ogProfileBlob) {
          console.error("Image Buffer is not truthy");
          setErrorMessage(err.refresh_please);
          setLoading(false);
          return;
        }

        const key = await client.uploadFile(ogProfileBlob, userId + "_og.png");
        await client.updateProfile(
          {
            canvas_info: {
              ogImageUrl: key,
            },
            updated_at: updated_at,
          },
          userId,
        );

        setLoading(false);
      } catch (e) {
        console.error(e);
        setErrorMessage(err.refresh_please);
        setLoading(false);
      }
    }, 3 * 1000);
  });
};

const checkValidState = (prevStateJson: string, currStateJson: string) => {
  return (
    currStateJson !== prevStateJson &&
    currStateJson !== initProfileStateJson &&
    prevStateJson !== initProfileStateJson
  );
};
