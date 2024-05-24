import { Profile } from "@/app/lib/types/supabase-alias";
import Link from "next/link";

import { isPlateInfo, isUserInfo } from "@/app/lib/types/type-checker";
import { clsx } from "clsx";
import { NintendoSwitchLogo } from "@/app/ui/icons/NintendoSwitchLogo";
import { SquidLogo } from "@/app/ui/icons/SquidLogo";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { XLogo } from "@/app/ui/icons/XLogo";

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
                "min-h-40 w-72 rotate-1 rounded-md border shadow-sm transition-transform hover:-rotate-2 hover:shadow-xl"
              }
            >
              <h2
                className={
                  "w-full rounded-t-md bg-gray-700 px-2 py-1 font-semibold text-white hover:opacity-75"
                }
              >
                {p.user_info.twitterInfo.name}
              </h2>

              <div className={"flex flex-col gap-0.5 px-4 py-3"}>
                <p
                  className={clsx(
                    "flex items-center gap-0.5 pl-1 text-sm font-semibold text-gray-700",
                    {
                      hidden: !p.user_info.twitterInfo.id,
                    },
                  )}
                >
                  <span className={"h-4 w-4"}>
                    <XLogo />
                  </span>
                  <span className={"pb-1"}>@{p.user_info.twitterInfo.id}</span>
                </p>
                <p
                  className={clsx("flex items-center gap-1", {
                    hidden: !p.user_info.switchInfo.name,
                  })}
                >
                  <span className={"h-6 w-6 fill-[#d42d22] text-[#d42d22]"}>
                    <SquidLogo className={"h-6 w-6"} />
                  </span>
                  {p.user_info.switchInfo.name}
                </p>

                <p
                  className={clsx("flex items-center gap-1 text-gray-700", {
                    hidden: !p.user_info.switchInfo.name,
                  })}
                >
                  <NintendoSwitchLogo
                    className={"h-6 w-6 fill-[#d42d22] text-[#d42d22]"}
                  />
                  {p.user_info.switchInfo.name}
                </p>
                <p
                  className={clsx("flex items-center gap-1 text-gray-700", {
                    hidden: !p.plate_info.name,
                  })}
                >
                  <span className={"h-6 w-6"}>
                    <ClipboardIcon />
                  </span>
                  {p.plate_info.name}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
