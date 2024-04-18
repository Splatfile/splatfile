import React from "react";
import { clsx } from "clsx";
import { InlineTextCardSkeleton } from "@/app/ui/components/server/TextCardSkeleton";

type LoadingProps = {};

export default function Loading(props: LoadingProps) {
  return (
    <div className={"flex flex-col items-stretch overflow-hidden"}>
      <div className={"flex h-full flex-col md:flex-row md:items-stretch"}>
        {/* 유저 사진 및 프로필 */}
        <div
          className={
            "animate-slide-right-full flex  h-full w-full items-center justify-center p-8 text-white md:w-1/3 md:items-stretch md:p-0 md:py-24"
          }
        >
          <div
            className={
              "flex h-full w-full animate-pulse flex-col items-center justify-center overflow-clip rounded-lg bg-amber-200"
            }
          >
            <div
              className={clsx(
                "flex w-full animate-pulse items-center justify-center ",
              )}
            >
              <div className={clsx("relative h-full w-full animate-pulse ")}>
                <div
                  className={
                    "aspect-[2/3] w-full rounded-t-md border-2 border-dashed border-gray-400 bg-gray-200 group-hover:border-gray-200 group-hover:bg-gray-50"
                  }
                ></div>

                <div
                  className={clsx(
                    "absolute inset-0 z-10  h-full w-full bg-black opacity-0 group-hover:flex",
                  )}
                >
                  <p className={"m-auto w-full text-white"}>
                    클릭해서 이미지 업로드
                  </p>
                </div>
              </div>
            </div>
            <button
              className={clsx(
                "relative aspect-[7/2] w-full max-w-full bg-gray-900",
              )}
            >
              <canvas
                className={"max-w-full"}
                style={{
                  aspectRatio: `auto ${700} / ${200}`,
                }}
                id="splashtag"
                width={700}
                height={200}
              />
              <div
                className={clsx(
                  "absolute inset-0 flex items-center justify-center bg-opacity-80 text-lg font-semibold hover:bg-opacity-50",
                  "flex h-full w-full items-center justify-center bg-black/50  text-white opacity-0 hover:opacity-100",
                )}
              ></div>
            </button>
          </div>
        </div>
        {/* 인게임 정보 */}
        <div className={"animate-slide-left-full w-full md:w-2/3"}>
          <div
            className={
              "flex w-full flex-col justify-center gap-2 py-6 pl-4 lg:px-8"
            }
          >
            <h2 className={"pb-2 pt-6 text-xl font-semibold"}>인게임 정보</h2>

            <div
              className={
                "align-center grid w-full justify-stretch gap-6 md:grid-cols-2 md:items-stretch md:justify-center"
              }
            >
              <InlineTextCardSkeleton />

              <InlineTextCardSkeleton />
              <InlineTextCardSkeleton />
              <InlineTextCardSkeleton />
            </div>
            <div className={"pt-4"}>
              <InlineTextCardSkeleton />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className={
            "flex w-full animate-slide-up flex-col justify-center gap-2 px-2 py-12 lg:px-8 xl:px-24"
          }
        >
          {/* 계정 정보*/}
          <div
            className={"flex h-full w-full justify-center gap-4 bg-gray-800"}
          >
            <InlineTextCardSkeleton />
            <InlineTextCardSkeleton />
            <InlineTextCardSkeleton />
            <InlineTextCardSkeleton />
          </div>
          <div className={"mt-4 flex w-full justify-center gap-2 "}>
            <InlineTextCardSkeleton />
            <InlineTextCardSkeleton />
          </div>
          <div className={"mt-4 flex w-full"}>
            <InlineTextCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
