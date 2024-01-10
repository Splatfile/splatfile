import Image from "next/image";
import { InlineTextCard } from "@/app/ui/components/InlineTextCard";
import { GameCardCommon } from "@/app/users/[userId]/profile/components/GameCardCommon";
import { GameCardXMatch } from "@/app/users/[userId]/profile/components/GameCardXMatch";

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
        <GameCardXMatch />

        <InlineTextCard title={"연어런"}>
          <div className={"flex w-full"}>
            <Image
              width={48}
              height={48}
              src="/ingames/level.png"
              alt="Splatoon Level Icon"
            />
            <p>{level}</p>
          </div>
          <div className={"flex"}>
            <Image
              width={48}
              height={48}
              src="/ingames/ranked.png"
              alt="Splatoon Rank Icon"
            />
            <p>{rank}</p>
          </div>
          <div className={"flex"}>
            <Image
              width={48}
              height={48}
              src="/ingames/salmon.png"
              alt="Splatoon Salmon Icon"
            />
            <p>{salmon}</p>
          </div>
        </InlineTextCard>
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
