import { Profile } from "@/app/lib/types/supabase-alias";
import Link from "next/link";

import { isPlateInfo, isUserInfo } from "@/app/lib/types/type-checker";

type SearchResultProps = {
  query: string;
  profiles?: Profile[];
};

export function SearchResult(props: SearchResultProps) {
  const { profiles, query } = props;

  if (!query || query.length < 2) {
    return <div>검색어는 2글자 이상 입력해주세요.</div>;
  }

  if (!profiles || profiles.length === 0) {
    return <div>검색 결과가 없습니다.</div>;
  }

  return (
    <div className={"grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3"}>
      {profiles.map((p) => {
        if (!isUserInfo(p.user_info) || !isPlateInfo(p.plate_info)) {
          return null;
        }
        return (
          <Link key={p.id} href={`/users/${p.user_id}/profile`}>
            <div
              key={p.id}
              className={
                "h-32 w-64 rotate-1 rounded-md border shadow-sm transition-transform hover:-rotate-2 hover:shadow-xl"
              }
            >
              <h2
                className={
                  "w-full rounded-t-md bg-gray-700 px-2 py-1 font-semibold text-white hover:opacity-75"
                }
              >
                {p.user_info.twitterInfo.name}
              </h2>

              <div className={"flex flex-col px-2 py-1.5"}>
                <p className={""}>{p.user_info.switchInfo.name}</p>
                <p className={"text-sm font-semibold text-gray-700"}>
                  @{p.user_info.twitterInfo.id}
                </p>
                <p className={"text-gray-700"}>{p.user_info.switchInfo.name}</p>
                <p className={"text-gray-700"}>{p.plate_info.name}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
