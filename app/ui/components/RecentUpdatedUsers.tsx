"use client";
import { useQuery } from "@tanstack/react-query";
import {
  getRecentUpdatedUsers,
  RecentUserObject,
} from "@/app/lib/constants/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type RecentUpdatedUsersProps = {};

export function RecentUpdatedUsers(props: RecentUpdatedUsersProps) {
  const { isPending, error, data } = useQuery({
    queryKey: [getRecentUpdatedUsers()],
    queryFn: () => fetch(getRecentUpdatedUsers()).then((res) => res.json()),
  });

  if (isPending) return <RecentUpdatedUsersSkeleton />;

  if (error) return "An error has occurred: " + error.message;

  const resentUsers = RecentUserObject.array().safeParse(data);

  if (!resentUsers.success)
    return "An error has occurred: " + resentUsers.error.message;

  const users = resentUsers.data;
  console.log("users", users);

  return (
    <div
      className={
        "flex w-full max-w-[28rem] flex-col justify-start gap-2 bg-gray-100 p-4 shadow"
      }
    >
      <h1 className={"w-full text-center text-xl text-gray-800"}>
        최근 갱신 유저
      </h1>
      <ul className={"flex flex-col gap-0.5 divide-y divide-gray-800"}>
        {users.map((user: any) => (
          <li key={user.id} className={"flex justify-between px-1 py-2"}>
            <Link
              href={`/users/${user.id}/profile`}
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

export const RecentUpdatedUsersSkeleton = () => {
  return (
    <div className={"w-72"}>
      <h1>최근 갱신된 유저</h1>
      <ul>
        {[1, 2, 3].map((id) => (
          <li key={id} className={"animate-pulse bg-gray-300"}>
            Loading...
          </li>
        ))}
      </ul>
    </div>
  );
};
