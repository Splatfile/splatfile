import { SwitchInfoCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/SwitchInfoCard";
import { TwitterInfoCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/TwitterInfoCard";
import { GenderCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/GenderCard";
import { SwitchCodeCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/SwitchCodeCard";
import { PlaytimeCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/PlayTimeCards";
import { IntroductionCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/IntroductionCard";
import { AccountLocale } from "@/app/lib/locales/locale";
import { UserInfo } from "@/app/lib/types/type-checker";

type AccountCardProps = {
  userInfo: UserInfo;
  accountLocale: AccountLocale;
  isMine: boolean;
};

export function AccountCard(props: AccountCardProps) {
  return (
    <div>
      <div className={"flex flex-col items-stretch "}>
        <div className={"sm:p-4"}>
          <div
            className={
              "bottom-auto mx-auto flex flex-col content-around justify-center gap-6 sm:grid-cols-2 sm:flex-row md:grid-cols-4"
            }
          >
            <SwitchInfoCard {...props} />
            <TwitterInfoCard {...props} /> {/* X / 트위터 */}
            <GenderCard {...props} />
            <SwitchCodeCard {...props} />
          </div>
          <div
            className={
              "mt-4 flex w-full min-w-60 items-center justify-center gap-4 md:flex-row"
            }
          >
            <PlaytimeCard {...props} timeType={"weekdayPlaytime"} />
            <PlaytimeCard {...props} timeType={"weekendPlaytime"} />
          </div>
        </div>
        <div className={"mt-4 sm:mx-2 sm:mt-0 sm:p-2"}>
          <IntroductionCard {...props} />
        </div>
      </div>
    </div>
  );
}
