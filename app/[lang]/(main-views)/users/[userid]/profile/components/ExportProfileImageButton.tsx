"use client";
import { ProfileCanvas } from "@/app/konva/components/ProfileCanvas";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { Profile } from "@/app/lib/locales/locale";

type ExportProfileImageModalProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile;
};

function ExportProfileImageModal({
  open,
  onClose,
  profile,
}: ExportProfileImageModalProps) {
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);

  const downloadImage = () => {
    if (canvasDataUrl === null) return;

    const a = document.createElement("a");
    a.href = canvasDataUrl;
    a.download = "splatfile-profile.png";
    a.click();
  };

  const ProfilePreview = ({ dataUrl }: { dataUrl: string | null }) => {
    const blankDataUrl =
      "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%20536%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%221024%22%20height%3D%22536%22%20fill%3D%22black%22%3E%3C%2Frect%3E%3C%2Fsvg%3E";
    //dataUrl 이 null일 경우에는 스피너
    return (
      <div className="relative">
        {dataUrl === null && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-red-100"></div>
          </div>
        )}
        <Image
          src={dataUrl || blankDataUrl}
          alt="profile rendering preview"
          className="h-auto w-full"
          width={0}
          height={0}
        />
      </div>
    );
  };

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      title={profile.ui_export_modal_title}
    >
      <div className={"block flex flex-col gap-4"}>
        <ProfilePreview dataUrl={canvasDataUrl} />
        <ProfileCanvas
          onRenderComplete={(dataUrl) => setCanvasDataUrl(dataUrl)}
          hidden={true}
        />
        <button
          className={
            "rounded bg-blue-400 px-4 py-2 font-bold text-white hover:bg-blue-700"
          }
          onClick={downloadImage}
        >
          {canvasDataUrl === null
            ? profile.ui_export_modal_download_button_rendering_wait
            : profile.ui_export_modal_download_button}
        </button>
      </div>
    </DefaultModal>
  );
}

type ExportProfileImageButtonProps = {
  profile: Profile;
};

export function ExportProfileImageButton({
  profile,
}: ExportProfileImageButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>
        <PhotoIcon className="mr-2 mt-1 h-6 w-6 text-gray-800" />
      </button>
      <ExportProfileImageModal open={open} onClose={() => setOpen(false)} profile={profile}/>
    </>
  );
}
