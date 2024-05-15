import { GameCard } from "@/app/(main-views)/users/[userid]/profile/components/game-information/GameCard";
import { AccountCard } from "@/app/(main-views)/users/[userid]/profile/components/AccountCard";
import { ProfileCard } from "@/app/(main-views)/users/[userid]/profile/components/ProfileCard";

export function ProfileWrapper() {
  return (
    <div className={"flex flex-col items-stretch"}>
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
      <div>
        <div
          className={
            "flex flex-col justify-center gap-2 px-2 py-12 lg:px-8 xl:px-24"
          }
        >
          {/* 계정 정보*/}
          <AccountCard />
        </div>
      </div>
    </div>
  );
}
