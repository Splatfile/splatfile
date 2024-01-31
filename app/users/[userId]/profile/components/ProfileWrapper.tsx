"use client";
import { ProfileCard } from "@/app/users/[userId]/profile/components/ProfileCard";
import { GameCard } from "@/app/users/[userId]/profile/components/GameCard";
import { AccountCard } from "@/app/users/[userId]/profile/components/AccountCard";
import {
  initProfileStore,
  useDebounceEdit,
} from "@/app/lib/hooks/use-profile-store";
import { Profile } from "@/app/lib/types/supabase-alias";

type ProfileWrapperProps = {
  profile: Profile;
  userId: string;
  isMine: boolean;
};

export function ProfileWrapper(props: ProfileWrapperProps) {
  const { profile, isMine, userId } = props;
  useDebounceEdit(userId, isMine);
  initProfileStore(profile, isMine);

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
          <GameCard></GameCard>
        </div>
      </div>
      <div>
        {/* 계정 정보*/}
        <AccountCard />
      </div>
    </div>
  );
}
