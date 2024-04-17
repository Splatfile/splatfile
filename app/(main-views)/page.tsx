import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative isolate my-8 overflow-hidden rounded-md bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            {/*<div className="inline-flex space-x-6">*/}
            {/*  <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">*/}
            {/*    스플랫파일*/}
            {/*  </span>*/}
            {/*</div>*/}
          </div>
          <h1 className="mt-10 break-normal text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            스플래툰 프로필 관리 <br /> 스플랫파일
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            스플랫파일을 통해 손 쉽게 스플래툰 프로필을 관리해 보세요! <br />
            프로필 사진 설정 랭크 및 무기 정보 수정, 플레이트 꾸미기 등 다양한
            기능을 제공합니다. 만드신 프로필은 이미지로 저장하여 공유하실 수
            있습니다.
            <br />
          </p>

          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/users/signin"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              시작하기
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
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
