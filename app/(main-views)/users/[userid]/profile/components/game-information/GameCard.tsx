"use client";

import { GameCardCommon } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCardCommon";
import { GameCardXMatch } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCardXMatch";
import { GameCardSalmonRun } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCardSalmonRun";
import { GameCardWeapons } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCardWeapons";
import { GameCardPlayStyle } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCardPlayStyle";

export function GameCard() {
  return (
    <div
      className={"flex w-full flex-col justify-center gap-2 py-6 pl-4 lg:px-8"}
    >
      <h2 className={"pb-2 pt-6 text-xl font-semibold"}>인게임 정보</h2>

      <div
        className={
          "align-center grid w-full justify-stretch gap-6 md:grid-cols-2 md:items-stretch md:justify-center"
        }
      >
        <GameCardCommon />
        {/* 랭크 S+ 이상일 때만 보여짐 */}
        <GameCardXMatch />
        {/*연어런 전설 등급 이상일 때만*/}
        <GameCardSalmonRun />

        <GameCardWeapons></GameCardWeapons>
      </div>
      <div className={"pt-4"}>
        <GameCardPlayStyle />
      </div>
    </div>
  );
}
