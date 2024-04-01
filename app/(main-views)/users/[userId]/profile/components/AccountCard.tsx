import { SwitchInfoCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/SwitchInfoCard";
import { TwitterInfoCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/TwitterInfoCard";
import { GenderCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/GenderCard";
import { SwitchCodeCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/SwitchCodeCard";
import { PlaytimeCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/PlayTimeCards";
import { IntroductionCard } from "@/app/(main-views)/users/[userId]/profile/components/account-information/IntroductionCard";

export function AccountCard() {
  return (
    <div>
      <h2 className={"pb-2 pt-6 text-xl font-semibold"}>계정 정보</h2>
      <div className={"flex flex-col items-stretch "}>
        <div className={"p-4"}>
          <div
            className={
              "bottom-auto mx-auto grid grid-flow-dense grid-cols-1 content-around justify-center gap-6 sm:grid-cols-2 md:grid-cols-4"
            }
          >
            <SwitchInfoCard />
            <TwitterInfoCard /> {/* X / 트위터 */}
            <GenderCard />
            <SwitchCodeCard />
          </div>
          <div
            className={
              "mt-4 flex w-full min-w-60 items-center justify-center gap-4 md:flex-row"
            }
          >
            <PlaytimeCard timeType={"weekdayPlaytime"} />
            <PlaytimeCard timeType={"weekendPlaytime"} />
          </div>
        </div>
        <div className={"mx-2 p-2"}>
          <IntroductionCard />
        </div>
      </div>
    </div>
  );
}
