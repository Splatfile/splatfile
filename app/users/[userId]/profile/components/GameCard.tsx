import { InlineTextCard } from "@/app/ui/components/InlineTextCard";
import { GameCardCommon } from "@/app/users/[userId]/profile/components/GameCardCommon";
import { GameCardXMatch } from "@/app/users/[userId]/profile/components/GameCardXMatch";
import { GameCardSalmonRun } from "@/app/users/[userId]/profile/components/GameCardSalmonRun";

export function GameCard() {
  const level = 46;
  const rank = "S+3";
  const salmon = "전설";
  const playstyle = "즐빡겜";

  return (
    <div
      className={"flex w-full flex-col justify-center gap-2 px-4 py-6 md:px-8"}
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
        <InlineTextCard title={"사용 무기"}>
          대충 무기 아이콘들 있어야함
        </InlineTextCard>
      </div>
      <div className={"pt-4"}>
        <InlineTextCard title={"플레이 스타일"}>
          <p>{playstyle}</p>
        </InlineTextCard>
      </div>
    </div>
  );
}
