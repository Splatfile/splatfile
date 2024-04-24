"use client";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import React, { useState } from "react";
import { XLogo } from "@/app/ui/icons/XLogo";
import Link from "next/link";

type XShareButtonProps = {};

export function XShareButton(props: XShareButtonProps) {
  const userInfo = useUserStore();
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = `#Splatfile ${name}의 스플래툰 프로필`;
  const text = "스플래툰 프로필을 확인해보세요!";

  const [error, setError] = useState<string | null>(null);

  const shareUrl = globalThis.location.href;
  const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div>
      <Link target={"_blank"} href={href}>
        <XLogo className="mr-2 h-6 w-6" />
      </Link>
    </div>
  );
}
