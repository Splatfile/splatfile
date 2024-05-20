import { AccountCard } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/AccountCard";
import { Ingame } from "@/app/lib/locales/locale";

type UserInfoWrapperProps = {
  ingame: Ingame;
};

export function UserInfoWrapper(props: UserInfoWrapperProps) {
  return (
    <div
      className={
        "mx-8 my-2 flex flex-col items-stretch rounded-lg bg-white p-4"
      }
    >
      {/* 계정 정보*/}
      <AccountCard ingame={props.ingame} />
    </div>
  );
}
