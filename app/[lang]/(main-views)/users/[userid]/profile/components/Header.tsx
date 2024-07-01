"use client";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { CLIENT_COMPONENT, SplatfileClient } from "@/app/lib/splatfile-client";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { LoadingLogo } from "@/app/ui/components/LoadingLogo";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { UserSearchBox } from "@/app/ui/components/UserSearchBox";
import { Header as HeaderLocale } from "@/app/lib/locales/locale";
import { header as en } from "@/app/lib/locales/en.json";
import { header as ko } from "@/app/lib/locales/ko.json";
import { header as ja } from "@/app/lib/locales/ja.json";
import { useTagLoadingStore } from "@/app/plate/lib/store/use-tag-store";
import Image from "next/image";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { profileUrl, signinUrl } from "@/app/plate/lib/const";
import { Lang } from "@/app/lib/types/component-props";
import { LocaleSetter } from "@/app/ui/components/LocaleSetter";
import useUser = Auth.useUser;

type HeaderProps = {};

export function Header(_: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerLocale, setHeaderLocale] = useState<HeaderLocale>(en);

  const params = useParams();
  useEffect(() => {
    const lang = params["lang"] ?? "en";
    if (lang === "ko") {
      setHeaderLocale(ko);
    } else if (lang === "ja") {
      setHeaderLocale(ja);
    } else {
      setHeaderLocale(en);
    }
  }, [params]);

  const { isLoading } = useEditStore();
  const { isLoading: isTagLoading } = useTagLoadingStore();

  return (
    <header className="bg-gray-900">
      <LocaleSetter />
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-start p-6 py-0 md:justify-between lg:px-8"
        aria-label="Global"
      >
        {/* 헤더 왼쪽 */}
        <div className="flex w-full items-center justify-start text-white lg:flex-1">
          <Link href={"/"}>
            <div className={"flex h-16 w-24"}>
              <Image
                className={"h-full object-contain"}
                width={660}
                height={529}
                src={"/splatfile-only-text.png"}
                alt={"Splatfile's Logo"}
              />
            </div>
          </Link>
          <div className="w-full md:hidden"></div>
          {(isLoading || isTagLoading) && (
            <div className={"mx-4 flex items-center justify-center"}>
              <LoadingLogo />
            </div>
          )}
        </div>
        {/* 모바일 헤더 오른쪽 */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">메뉴 열기</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {/* 헤더 가운데 */}
        <div className="hidden lg:flex lg:gap-x-12">
          <UserSearchBox header={headerLocale} />
        </div>
        {/* 헤더 오른쪽 */}
        <div className="hidden gap-4 lg:flex lg:flex-1 lg:justify-end">
          <SignInButton header={headerLocale} />
          <LanguageSetting header={headerLocale} />
        </div>
      </nav>
      {/*메뉴가 늘어날 시 사용*/}
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/25">
              <div className="flex flex-col gap-2 py-6">
                <SignInButton
                  header={headerLocale}
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                />
                <LanguageSetting
                  header={headerLocale}
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      <div className={"w-full md:hidden"}>
        <UserSearchBox header={headerLocale} />
      </div>
    </header>
  );
}

type SignInButtonProps = {
  header: HeaderLocale;
  onClick?: () => void;
};
export const SignInButton = (props: SignInButtonProps) => {
  const { header, onClick } = props;
  const { user } = useUser();
  const client = new SplatfileClient(CLIENT_COMPONENT);
  const router = useRouter();
  if (user) {
    return (
      <>
        <Link
          className={
            "cursor-pointer rounded-md px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
          }
          href={profileUrl(user.id)}
          onClick={onClick}
          prefetch={false}
        >
          {header.ui_my_profile}
        </Link>
        <button
          className={
            "cursor-pointer rounded-md px-3 py-2 text-left text-base font-semibold leading-7 text-white hover:bg-gray-800"
          }
          onClick={async () => {
            await client.supabase.auth.signOut();
            router.refresh();
            onClick?.();
          }}
        >
          {header.ui_logout}
        </button>
      </>
    );
  }
  return (
    <Link
      key={header.ui_login}
      href={signinUrl}
      onClick={onClick}
      prefetch={false}
      className="-mx-3 block cursor-pointer rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
    >
      <span>{header.ui_login}</span>
    </Link>
  );
};

type LanguageSettingProps = {
  header: HeaderLocale;
  onClick?: () => void;
};
const LanguageSetting = (props: LanguageSettingProps) => {
  const { header, onClick } = props;
  const router = useRouter();
  const params = useParams();

  const changeLanguage = (lang: Lang) => () => {
    const currentLang: string = params["lang"] as string;
    const currentPath = location.pathname;
    if (currentLang === lang) {
      return;
    }
    if (!currentLang) {
      router.push(`/${lang}`);
      return;
    }
    router.push(currentPath.replace(currentLang, lang));
    onClick?.();
  };

  return (
    <Menu>
      <MenuButton
        className={
          "cursor-pointer rounded-md px-3 py-2 text-left text-base font-semibold leading-7 text-white hover:bg-gray-800"
        }
      >
        {header.ui_language_setting}
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className={
          "z-20 flex w-full flex-col gap-3 rounded-md bg-gray-900 px-2 py-2 text-lg text-white sm:w-32"
        }
      >
        <MenuItem>
          <button
            className="block px-3 py-2 data-[focus]:bg-blue-100"
            onClick={changeLanguage("ko")}
          >
            한국어
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="block px-3 py-2 data-[focus]:bg-blue-100"
            onClick={changeLanguage("en")}
          >
            English
          </button>
        </MenuItem>
        <MenuItem>
          <button
            className="block px-3 py-2 data-[focus]:bg-blue-100"
            onClick={changeLanguage("ja")}
          >
            日本語
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};
