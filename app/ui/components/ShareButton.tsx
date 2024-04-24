"use client";
import React, { useState } from "react";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface ShareButtonProps {}

export const ShareButton: React.FC<ShareButtonProps> = () => {
  const userInfo = useUserStore();
  const name = userInfo.twitterInfo?.name || userInfo.switchInfo?.name || "";
  const title = `${name}의 스플래툰 프로필`;
  const text = "스플래툰 프로필을 확인해보세요!";

  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title, // 제목 (옵션)
          text: text, // 본문 내용 (옵션)
          url: globalThis.location.href, // 공유할 URL
        });
      } catch (err) {
        setError("공유에 실패했습니다.");
      }
    } else {
      setError("이 브라우저는 공유 기능을 지원하지 않습니다.");
    }
  };

  return (
    <button onClick={handleShare}>
      <ArrowUpTrayIcon className="mr-2 mt-1 h-6 w-6 text-gray-800" />
    </button>
  );
};
