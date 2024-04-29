"use client";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import React, { useEffect, useState } from "react";
import { XLogo } from "@/app/ui/icons/XLogo";
import Link from "next/link";

type XShareButtonProps = {};

export function XShareButton(props: XShareButtonProps) {
  const userInfo = useUserStore();
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = `#Splatfile ${name}의 스플래툰 프로필`;

  const [href, setHref] = useState<string | undefined>("");

  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shareUrl = globalThis.location?.href;
    const shareHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title,
    )}&url=${encodeURIComponent(shareUrl)}`;
    setHref(shareHref);
  }, [title]);

  return (
    <div>
      <Link target={"_blank"} href={href || ""}>
        <XLogo className="mr-2 h-6 w-6" />
      </Link>
    </div>
  );
}
