"use client";
import React, { useState } from "react";
import { useUserStore } from "@/app/lib/hooks/use-profile-store";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import { ProfileCanvas } from "@/app/konva/components/ProfileCanvas";

type ExportProfileImageModalProps = {
  open: boolean;
  onClose: () => void;
};

function ExportProfileImageModal({
  open,
  onClose,
}: ExportProfileImageModalProps) {
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      title={"프로필 이미지 내보내기"}
    >
      <div className={"flex flex-col gap-4"}>
        <ProfileCanvas
          dataUrlCallback={(dataUrl) => setCanvasDataUrl(dataUrl)}
          isLoading={canvasDataUrl === null}
        />
        <button>
          <a href={canvasDataUrl || ""} download={"splatfile-profile.png"}>
            {canvasDataUrl === null ? "렌더링 중..." : "다운로드"}
          </a>
        </button>
      </div>
    </DefaultModal>
  );
}

export function ExportProfileImageButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <PhotoIcon className="mr-2 mt-1 h-6 w-6 text-gray-800" />
      </button>
      <ExportProfileImageModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
