import Link from "next/link";
import Image from "next/image";
import { RecentUpdatedUsers } from "@/app/ui/components/RecentUpdatedUsers";
import { PageProps } from "@/app/lib/types/component-props";
import { getDictionary, getHtml } from "@/app/lib/dictionaries";

export default async function Page(props: PageProps) {
  const dictionary = await getDictionary(props.params.lang);
  const main = dictionary["main"];

  return (
    <div className="relative isolate my-8 overflow-hidden rounded-md bg-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-10">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16"></div>
          <h1
            className="mt-10 animate-slide-up break-normal text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            {...getHtml(main.first_section_title)}
          />
          <p
            className="mt-6 animate-slide-up text-lg leading-8 text-gray-600"
            {...getHtml(main.first_section_description)}
          />
          <div className="mt-10 flex animate-slide-up items-center gap-x-6">
            <a
              href="/users/signin"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              {...getHtml(main.first_section_button)}
            />
          </div>
          <div className={"p-8"}>
            <RecentUpdatedUsers ui={dictionary["ui"]} />
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl animate-slide-left-full sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/samples/hero_main.png"
                alt="Splatfile screenshot"
                width={1308}
                height={994}
                className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
      <Link
        className={"text-blue-500"}
        href={"/users/7973f2b0-ee0d-43ab-aeaf-a4d978e1609d/profile"}
      >
        임시 프로필로 이동
      </Link>
    </div>
  );
}
