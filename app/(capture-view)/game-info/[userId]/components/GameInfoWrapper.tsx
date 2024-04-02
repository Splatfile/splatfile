import { ProfileCard } from "@/app/(main-views)/users/[userId]/profile/components/ProfileCard";
import { GameCard } from "@/app/(main-views)/users/[userId]/profile/components/game-information/GameCard";

type GameInfoWrapperProps = {};

export function GameInfoWrapper(props: GameInfoWrapperProps) {
  return (
    <div
      className={
        "mx-8 my-2 flex flex-col items-stretch rounded-lg bg-white p-4"
      }
    >
      <div className={"flex h-full flex-col md:flex-row md:items-stretch"}>
        {/* 유저 사진 및 프로필 */}
        <div
          className={
            "flex h-full w-full items-center justify-center p-8 text-white md:w-1/3 md:items-stretch md:p-0 md:py-24"
          }
        >
          <ProfileCard />
        </div>
        {/* 인게임 정보 */}
        <div className={"w-full md:w-2/3"}>
          <GameCard />
        </div>
      </div>
    </div>
  );
}
