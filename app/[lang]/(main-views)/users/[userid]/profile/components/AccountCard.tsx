import { SwitchInfoCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/SwitchInfoCard";
import { TwitterInfoCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/TwitterInfoCard";
import { GenderCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/GenderCard";
import { SwitchCodeCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/SwitchCodeCard";
import { PlaytimeCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/PlayTimeCards";
import { IntroductionCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/account-information/IntroductionCard";
import { Account } from "@/app/lib/locales/locale";
import { getHtml } from "@/app/lib/dictionaries";

type AccountCardProps = {
  account: Account;
};

export function AccountCard(props: AccountCardProps) {
  const { account } = props;
  return (
    <div>
      <h2
        className={"pb-2 pt-6 text-xl font-semibold"}
        {...getHtml(account.ui_information)}
      ></h2>
      <div className={"flex flex-col items-stretch "}>
        <div className={"p-4"}>
          <div
            className={
              "bottom-auto mx-auto grid grid-flow-dense grid-cols-1 content-around justify-center gap-6 sm:grid-cols-2 md:grid-cols-4"
            }
          >
            <SwitchInfoCard account={account} />
            <TwitterInfoCard account={account} /> {/* X / 트위터 */}
            <GenderCard account={account} />
            <SwitchCodeCard account={account} />
          </div>
          <div
            className={
              "mt-4 flex w-full min-w-60 items-center justify-center gap-4 md:flex-row"
            }
          >
            <PlaytimeCard account={account} timeType={"weekdayPlaytime"} />
            <PlaytimeCard account={account} timeType={"weekendPlaytime"} />
          </div>
        </div>
        <div className={"mx-2 p-2"}>
          <IntroductionCard account={account} />
        </div>
      </div>
    </div>
  );
}
