"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { SplatPlateEditor } from "@/app/plate/ui/SplatPlateEditor";
import { clsx } from "clsx";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  getPlateLang,
  loadFonts,
  renderPlate,
} from "@/app/plate/lib/render-plate";
import {
  isInitPlates,
  setTagLanguage,
} from "@/app/plate/lib/store/use-tag-store";
import { Lang } from "@/app/lib/types/component-props";
import { PlateInfo } from "@/app/lib/types/type-checker";
import { ProfileLocale } from "@/app/lib/locales/locale";

type PlateImageProps = {
  plateInfo: PlateInfo;
  profile: ProfileLocale;
  isMine: boolean;
  lang: Lang;
};

export function PlateImage(props: PlateImageProps) {
  const { profile, lang, plateInfo, isMine } = props;
  const [open, setOpen] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [language, setLanguage] = useState<Lang>(lang);

  useEffect(() => {
    if (!canvasRef.current) return;
    // initPlate 렌더 방지
    // 이 방법이 옳진 않지만 현재 플레이트를 분리하기엔 너무 작업이 크므로 일단 이렇게 진행
    if (isInitPlates(plateInfo)) return;
    renderPlate(canvasRef.current, plateInfo, getPlateLang(language))
      .then(() => {
        console.log("Plate rendered");
      })
      .catch((e) => {
        console.error(e);
      });
  }, [language, plateInfo]);

  useEffect(() => {
    setTimeout(() => {
      if (!canvasRef.current) return;
      if (isInitPlates(plateInfo)) return;

      renderPlate(canvasRef.current, plateInfo, getPlateLang(language))
        .then(() => {
          console.log("rerendered");
        })
        .catch((e) => {
          console.error(e);
        });
    }, 1500);
  }, [fontLoaded]);

  useEffect(() => {
    setTagLanguage(getPlateLang(language));
  }, [language]);

  useEffect(() => {
    const timeout = setInterval(async () => {
      const fontLoaded = await loadFonts(getPlateLang(lang));

      setFontLoaded(fontLoaded);

      if (fontLoaded) {
        clearInterval(timeout);
      }
    }, 1500);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  return (
    <button
      disabled={!isMine}
      onClick={() => setOpen(true)}
      className={clsx(
        "relative aspect-[7/2] w-full max-w-full rounded-md bg-gray-900 shadow-xl",
        isMine && "cursor-pointer hover:opacity-80",
      )}
    >
      <PlateModal
        open={open}
        setOpen={setOpen}
        profileLocale={profile}
        language={language}
        setLanguage={setLanguage}
      />
      <canvas
        className={"max-w-full rounded-md border-2 border-gray-800"}
        style={{
          aspectRatio: `auto ${700} / ${200}`,
        }}
        ref={canvasRef}
        id="splashtag"
        width={700}
        height={200}
      />
      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center bg-opacity-80 text-lg font-semibold hover:bg-opacity-50",
          isMine
            ? "flex h-full w-full items-center justify-center bg-black/50  text-white opacity-0 hover:opacity-100"
            : "hidden",
        )}
      >
        <p className={isMine ? "text-white" : "hidden"}>
          {profile.ui_update_plate_button}
        </p>
      </div>
    </button>
  );
}

type PlateModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  profileLocale: ProfileLocale;
  language: Lang;
  setLanguage: (lang: Lang) => void;
};

export function PlateModal(props: PlateModalProps) {
  const { open, setOpen, profileLocale, language, setLanguage } = props;

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        id={"plate-modal"}
        className="relative z-10"
        onClose={() => setOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex h-screen items-end justify-center text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="w-full transform overflow-hidden rounded-lg bg-gray-800 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-lg sm:px-2">
                <div className={""}>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h2"
                      className="mb-4 mt-8 text-xl font-semibold leading-6 text-white"
                    >
                      {profileLocale.ui_plate_modal_title}
                    </DialogTitle>
                    <SplatPlateEditor
                      language={language}
                      setLanguage={setLanguage}
                    />
                    <button
                      type="button"
                      className="inline-flex w-40 justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                      onClick={() => setOpen(false)}
                    >
                      {profileLocale.ui_plate_modal_confirm_button}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
