"use client";
import React, { useEffect, useState } from "react";
import { XLogo } from "@/app/ui/icons/XLogo";
import Link from "next/link";
import { ProfileLocale } from "@/app/lib/locales/locale";
import { UserInfo } from "@/app/lib/types/type-checker";

type XShareButtonProps = {
  profileLocale: ProfileLocale;
  userInfo: UserInfo;
};

export function XShareButton({ profileLocale, userInfo }: XShareButtonProps) {
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = profileLocale.ui_share_to_x_text.replace("{{name}}", name);

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
