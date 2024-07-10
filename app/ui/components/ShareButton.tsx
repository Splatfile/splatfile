"use client";
import React, { useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { ProfileLocale } from "@/app/lib/locales/locale";
import Toast from "@/app/ui/components/Toast";
import { UserInfo } from "@/app/lib/types/type-checker";

interface ShareButtonProps {
  profileLocale: ProfileLocale;
  userInfo: UserInfo;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  userInfo,
  profileLocale,
}) => {
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = profileLocale.ui_share_to_x_text.replace("{{name}}", name);
  const text = profileLocale.ui_share_desc;

  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    const url = globalThis.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(profileLocale.ui_share_copied_url);
      },
      (err) => {
        // 일어나지 말아야할 상황으로, 발생할 경우 그냥 유저에게 보여주도록 한다.(리포트 가능하게)
        setError("Copy failed: " + err);
        console.error("Copy failed: ", err);
      },
    );
  };

  return (
    <button onClick={handleShare}>
      <ArrowUpTrayIcon className="mr-2 mt-1 h-6 w-6 text-gray-800" />
      {error && (
        <Toast message={error} duration={500} onClose={() => setError("")} />
      )}
    </button>
  );
};
