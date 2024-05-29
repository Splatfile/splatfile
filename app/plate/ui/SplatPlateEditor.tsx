"use client";
import { useEffect, useRef, useState } from "react";
import { TextTab } from "./splashtag-editor/TextTab";
import lang from "../lang.json";
import { BannerTab } from "./splashtag-editor/BannerTab";
import { BadgeTab } from "./splashtag-editor/BadgeTab";
import { useTagStore } from "../lib/store/use-tag-store";
import { renderPlate } from "../lib/render-plate";
import { clsx } from "clsx";
import { useTagPosition } from "../lib/store/use-position";
import "../index.css";
import { Lang } from "@/app/lib/types/component-props";
import { useParams } from "next/navigation";

const language = "KRko";

export const getLanguage = (key: Lang) => {
  switch (key) {
    case "en":
      return "USen";
    case "ko":
      return "KRko";
    case "ja":
      return "JPja";
    default:
      return "USen";
  }
};

export function SplatPlateEditor() {
  const [language, setLanguage] = useState<Lang>("en");

  const [tab, setTab] = useState(0);
  const tag = useTagStore();
  const positions = useTagPosition();
  const params = useParams();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!canvasRef.current) return;
      renderPlate(canvasRef.current, tag).then(() => {
        console.log("rendered");
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [tag, positions]);

  useEffect(() => {
    const lang = (params["lang"] as Lang) ?? "en";
    setLanguage(lang);
  }, [params]);

  return (
    <div className="p-2 sm:p-8">
      <div className={"flex items-center justify-center"}>
        <canvas
          className={"max-w-full"}
          style={{
            aspectRatio: `auto ${positions.tagSize.w} / ${positions.tagSize.h}`,
          }}
          ref={canvasRef}
          id="splashtag"
          width={positions.tagSize.w}
          height={positions.tagSize.h}
        />
      </div>
      <div
        // style={{
        //   backgroundImage: `url(${base}/backgrounds/tab-background.png)`,
        // }}
        className={
          "mx-auto mt-4 min-h-[420px] w-full overflow-clip rounded-md backdrop-brightness-95 sm:mt-8 md:max-w-3xl"
        }
      >
        <div className="flex h-full max-h-[calc(100vh-120px)] bg-gray-900 md:h-[420px]">
          <div
            className={
              "flex h-full min-w-fit flex-col items-start justify-start "
            }
          >
            <div className="h-full ">
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex h-full grow flex-col gap-y-5 overflow-y-auto bg-opacity-90 px-2 pb-4 sm:pl-2">
                <nav className="h-full">
                  <ul role="list" className="space-y-1 py-3">
                    <button
                      onClick={() => setTab(0)}
                      className={clsx(
                        tab === 0
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                      name="tabText"
                    >
                      {lang[getLanguage(language)].ui.tabText}
                    </button>
                    <button
                      onClick={() => setTab(1)}
                      className={clsx(
                        tab === 1
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                      type="button"
                      name="tabBanners"
                    >
                      {lang[getLanguage(language)].ui.tabBanners}
                    </button>
                    <button
                      onClick={() => setTab(2)}
                      className={clsx(
                        tab === 2
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                      type="button"
                      name="tabBadges"
                    >
                      {lang[getLanguage(language)].ui.tabBadges}
                    </button>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="h-full w-full  px-2 text-white backdrop-contrast-125">
            {/*Text --- Name, Tag, Titles*/}
            {tab === 0 && (
              <TextTab
                setLang={(lang: Lang) => setLanguage(lang)}
                lang={language}
              />
            )}
            {tab === 1 && <BannerTab lang={language} />}
            {tab === 2 && <BadgeTab lang={language} />}
          </div>
        </div>
      </div>
    </div>
  );
}
