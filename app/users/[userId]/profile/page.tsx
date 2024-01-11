import { AccountCard } from "@/app/users/[userId]/profile/components/AccountCard";
import { GameCard } from "@/app/users/[userId]/profile/components/GameCard";
import { ProfileCard } from "@/app/users/[userId]/profile/components/ProfileCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-1 md:p-8">
      <main
        className={
          "h-full w-full max-w-screen-2xl rounded-2xl bg-white/95 px-2 py-4 md:p-6"
        }
      >
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
              <GameCard></GameCard>
            </div>
          </div>
          <div>
            {/* 계정 정보*/}
            <AccountCard />
          </div>
        </div>
      </main>
    </div>
  );
}
