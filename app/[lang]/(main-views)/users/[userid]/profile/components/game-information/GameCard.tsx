import { GameCardXMatch } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardXMatch";
import { GameCardSalmonRun } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardSalmonRun";
import { GameCardWeapons } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardWeapons";
import { GameCardPlayStyle } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardPlayStyle";
import { Lang } from "@/app/lib/types/component-props";
import { IngameLocale } from "@/app/lib/locales/locale";
import { GameInfo } from "@/app/lib/types/type-checker";
import { GameCardCommonWithStore } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/game-information/GameCardCommonWithStore";

type GameCardProps = {
  lang: Lang;
  gameInfo: GameInfo;
  ingameLocale: IngameLocale;
  isMine: boolean;
};

export function GameCard(props: GameCardProps) {
  const { lang, ...commonProps } = props;
  return (
    <div
      className={"flex w-full flex-col justify-center gap-2 px-2 py-6 lg:px-8"}
    >
      <div
        className={
          "align-center grid w-full justify-stretch gap-6 md:grid-cols-2 md:items-stretch md:justify-center"
        }
      >
        <GameCardCommonWithStore lang={lang} {...commonProps} />
        {/* 랭크 S+ 이상일 때만 보여짐 */}
        <GameCardXMatch {...commonProps} />
        {/*연어런 전설 등급 이상일 때만*/}
        <GameCardSalmonRun {...commonProps} />
        <GameCardWeapons {...commonProps} />
      </div>
      <div className={"pt-4"}>
        <GameCardPlayStyle {...commonProps} />
      </div>
    </div>
  );
}
