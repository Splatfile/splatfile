import Image from "next/image";
import { RecentUpdatedUsers } from "@/app/ui/components/RecentUpdatedUsers";
import { PageProps } from "@/app/lib/types/component-props";
import { getDictionary, getHtml } from "@/app/lib/dictionaries";
import { signinUrl } from "@/app/plate/lib/const";
import { QueryClientWrapper } from "@/app/lib/hooks/query-client-wrapper";

export const revalidate = 0;

export default async function Page(props: PageProps) {
  const dictionary = await getDictionary(props.params.lang);
  const main = dictionary["mainLocale"];
  const maxImageIndexByLang = {
    ko: 4,
    en: 1,
    ja: 2,
  };
  const randomIndex =
    Math.floor(Math.random() * maxImageIndexByLang[props.params.lang]) + 1;

  const bannerImageUrl = `/samples/${props.params.lang}/${randomIndex}.png`;

  return (
    <div className="relative isolate my-8 overflow-hidden rounded-md bg-white shadow-2xl">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-0 sm:pb-32 lg:flex lg:px-8 lg:py-10">
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
              href={signinUrl}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              {...getHtml(main.first_section_button)}
            />
          </div>
          <div className={"p-8"}>
            <QueryClientWrapper>
              <RecentUpdatedUsers uiLocale={dictionary["uiLocale"]} />
            </QueryClientWrapper>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl animate-slide-left-full sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:my-auto lg:mt-12 lg:rounded-2xl lg:p-4">
              <Image
                src={bannerImageUrl}
                alt="Splatfile screenshot"
                width={1400}
                height={1000}
                className="w-[60rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
