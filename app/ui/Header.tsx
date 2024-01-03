import Link from "next/link";

export function Header() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-gray-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* 헤더 왼쪽 */}
        <div className="flex text-white lg:flex-1">
          <a href={"#"}>Hello Splatfile</a>
        </div>
        {/* 모바일 헤더 오른쪽 */}
        <div className="flex lg:hidden">
          {/* 메뉴가 늘어날 시 사용 */}
          {/*<button*/}
          {/*  type="button"*/}
          {/*  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"*/}
          {/*  onClick={() => setMobileMenuOpen(true)}*/}
          {/*>*/}
          {/*  <span className="sr-only">메뉴 열기</span>*/}
          {/*  <Bars3Icon className="h-6 w-6" aria-hidden="true" />*/}
          {/*</button>*/}
          <Link
            key={"로그인"}
            href={"/login"}
            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
          >
            <span>{"로그인"}</span>
          </Link>
        </div>
        {/* 헤더 가운데 */}
        <div className="hidden lg:flex lg:gap-x-12"></div>
        {/* 헤더 오른쪽 */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link
            key={"로그인"}
            href={"/login"}
            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
          >
            <span>{"로그인"}</span>
            <span className={"ml-2"} aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>
      </nav>
      {/*메뉴가 늘어날 시 사용*/}
      {/*<Dialog*/}
      {/*  as="div"*/}
      {/*  className="lg:hidden"*/}
      {/*  open={mobileMenuOpen}*/}
      {/*  onClose={setMobileMenuOpen}*/}
      {/*>*/}
      {/*  <div className="fixed inset-0 z-10" />*/}
      {/*  <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">*/}
      {/*    <div className="flex items-center justify-between">*/}
      {/*      <button*/}
      {/*        type="button"*/}
      {/*        className="-m-2.5 rounded-md p-2.5 text-gray-400"*/}
      {/*        onClick={() => setMobileMenuOpen(false)}*/}
      {/*      >*/}
      {/*        <span className="sr-only">Close menu</span>*/}
      {/*        <XMarkIcon className="h-6 w-6" aria-hidden="true" />*/}
      {/*      </button>*/}
      {/*    </div>*/}
      {/*    <div className="mt-6 flow-root">*/}
      {/*      <div className="-my-6 divide-y divide-gray-500/25">*/}
      {/*        <div className="py-6">*/}
      {/*          <Link*/}
      {/*            key={"로그인"}*/}
      {/*            href={"/login"}*/}
      {/*            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"*/}
      {/*          >*/}
      {/*            {"로그인"}*/}
      {/*          </Link>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </Dialog.Panel>*/}
      {/*</Dialog>*/}
    </header>
  );
}