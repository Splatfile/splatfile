import { LinkIcon } from "@heroicons/react/16/solid";
// import React from "react";
import { GithubIcon } from "../icons/GithubIcon";

export function ShareTab() {
  return (
    <div>
      <SocialShare />
    </div>
  );
}

const SocialShare = () => {
  const url = location.href;
  // const title = "스플랫 플레이트";

  // const twitterShareUrl = `https://twitter.com/share?url=${encodeURIComponent(
  //   url,
  // )}&text=${encodeURIComponent(title)}`;

  const copyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className={"flex flex-col gap-8 p-8"}>
      <div className={"flex flex-col items-center justify-center gap-4"}>
        <p className={"text-center"}>
          본 프로젝트의 소스 코드는 아래 링크에서 확인 하실 수 있습니다.
        </p>
        <a
          href={"https://github.com/dev-jelly/splat-plate"}
          className="h-6 w-6 fill-white text-white hover:fill-gray-200"
        >
          <GithubIcon />
        </a>
      </div>
      <div className={"gap-4"}>
        <h3 className={"text-center text-white"}>
          내가 만든 플레이트 공유하기 (트위터로 공유 준비중)
        </h3>
        <div className="flex justify-center space-x-4 pt-2">
          {/*<a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">*/}
          {/*  <TwitterIcon className="h-6 w-6 fill-white hover:fill-gray-200" />*/}
          {/*</a>*/}
          <button onClick={copyLink}>
            <LinkIcon className="h-6 w-6 fill-white hover:fill-gray-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
