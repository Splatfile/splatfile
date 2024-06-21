"use client";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import React, { useEffect, useState } from "react";
import { XLogo } from "@/app/ui/icons/XLogo";
import Link from "next/link";
import { Profile } from "@/app/lib/locales/locale";

type XShareButtonProps = {
  profile: Profile;
};

export function XShareButton({ profile }: XShareButtonProps) {
  const userInfo = useUserStore();
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = profile.ui_share_to_x_text.replace("{{name}}", name);

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
