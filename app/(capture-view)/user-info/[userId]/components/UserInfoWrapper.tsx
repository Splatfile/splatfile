import { AccountCard } from "@/app/(main-views)/users/[userId]/profile/components/AccountCard";

type UserInfoWrapperProps = {};

export function UserInfoWrapper(props: UserInfoWrapperProps) {
  return (
    <div
      className={
        "mx-8 my-2 flex flex-col items-stretch rounded-lg bg-white p-4"
      }
    >
      {/* 계정 정보*/}
      <AccountCard />
    </div>
  );
}
