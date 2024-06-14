"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Header } from "@/app/lib/locales/locale";

type UserSearchBoxProps = {
  header: Header;
};

export function UserSearchBox(props: UserSearchBoxProps) {
  const { header } = props;
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setQuery(q);
    }
  }, []);

  const onSearch = (query: string) => {
    router.push(`/users/search?q=${query}`);
  };

  return (
    <form
      className={
        "mb-2 flex w-full gap-2 rounded-b-md bg-gray-600 px-4 py-2 md:mb-0 md:bg-inherit md:px-0 md:py-0"
      }
      action={"/users/search"}
      onSubmit={(e) => {
        onSearch(query);
      }}
    >
      <input
        className={"h-12 w-full rounded-md bg-gray-700 px-2 text-white md:w-64"}
        type="text"
        placeholder={header.ui_user_search_placeholder}
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
