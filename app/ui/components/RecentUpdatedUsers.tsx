"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getRecentUpdatedUsers,
  RecentUserObject,
} from "@/app/lib/constants/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { profileUrl } from "@/app/plate/lib/const";
import { UILocale } from "@/app/lib/locales/locale";

type RecentUpdatedUsersProps = {
  uiLocale: UILocale;
};

export function RecentUpdatedUsers(props: RecentUpdatedUsersProps) {
  const { uiLocale } = props;
  const { isPending, error, data } = useQuery({
    queryKey: [getRecentUpdatedUsers()],
    queryFn: () => fetch(getRecentUpdatedUsers()).then((res) => res.json()),
  });

  if (isPending) return <RecentUpdatedUsersSkeleton uiLocale={uiLocale} />;

  if (error) return "An error has occurred: " + error.message;

  const resentUsers = RecentUserObject.array().safeParse(data);

  if (!resentUsers.success) {
    return "An error has occurred: " + resentUsers.error.message;
  }
  const users = resentUsers.data;

  return (
    <div
      className={
        "flex w-full max-w-[28rem] flex-col justify-start gap-2 bg-gray-100 p-4 shadow"
      }
    >
      <h1 className={"w-full text-center text-xl text-gray-800"}>
        {uiLocale.recent_users_title}
      </h1>
      <ul className={"flex flex-col gap-0.5 divide-y divide-gray-800"}>
        {users.map((user: any) => (
          <li
            key={user.userId}
            className={"flex items-center justify-between px-1 py-2"}
          >
            <Link
              prefetch={true}
              href={profileUrl(user.userId)}
              className={`text-blue-600 hover:text-blue-400 hover:underline`}
            >
              {user.name}
            </Link>
            <p className={"text-sm text-gray-600"}>
              {formatDistanceToNow(user.lastUpdated, {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const RecentUpdatedUsersSkeleton = (props: RecentUpdatedUsersProps) => {
  const { uiLocale } = props;
  const temp = Array.from({ length: 5 }, (_, i) => i);
  return (
    <div
      className={
        "flex w-full max-w-[28rem] animate-slide-up flex-col justify-start gap-2 bg-gray-100 p-4 shadow"
      }
    >
      <h1 className={"w-full text-center text-xl text-gray-800"}>
        {uiLocale.recent_users_title}
      </h1>
      <ul className={"flex flex-col gap-0.5 divide-y divide-gray-800"}>
        {temp.map((i) => (
          <li key={i} className={"flex justify-between px-1 py-2"}>
            <div
              className={`h-8 w-full animate-pulse rounded-md bg-gray-600/50 hover:text-blue-400 hover:underline`}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  );
};
