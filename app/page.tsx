import { AccountCard } from "@/app/ui/AccountCard";
import { GameCard } from "@/app/ui/GameCard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-1">
      <main
        className={
          "h-full w-full max-w-screen-xl rounded-2xl bg-neutral-100 px-2 py-4 sm:p-4"
        }
      >
        <div className={"flex flex-col md:flex-row"}>
          <div className={"flex flex-col"}>
            {/* 유저 사진 및 프로필 */}
            <div className={"h-96 w-48 bg-amber-700 text-white"}>
              대충 유저 사진 및 프로필 영역
            </div>
            {/* 인게임 정보 */}
            <GameCard></GameCard>
          </div>
          {/* 계정 정보*/}
          <AccountCard />
        </div>
      </main>
    </div>
  );
}
