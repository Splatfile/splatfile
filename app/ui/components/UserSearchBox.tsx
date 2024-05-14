"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";

type UserSearchBoxProps = {};

export function UserSearchBox(props: UserSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const onSearch = (query: string) => {
    router.push(`/users/search?q=${query}`);
  };

  return (
    <form
      className={"flex gap-2"}
      action={"/users/search"}
      onSubmit={(e) => {
        onSearch(query);
      }}
    >
      <input
        className={"h-12 w-64 rounded-md bg-gray-700 px-2 text-white"}
        type="text"
        value={query}
        name={"q"}
        onKeyDown={(e) => {
          // Enter
          if (e.key === "Enter") {
            onSearch(query);
          }
        }}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        type={"submit"}
        className={"rounded-md border border-gray-400"}
        onClick={() => onSearch(query)}
      >
        <div
          className={
            "flex h-12 w-12 items-center justify-center fill-white px-2 text-white hover:opacity-75"
          }
        >
          <MagnifyingGlassIcon />
        </div>
      </button>
    </form>
  );
}
