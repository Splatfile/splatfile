import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import Cropper from "react-easy-crop";
import { useParams } from "next/navigation";
import { setProfileImageUrl } from "@/app/lib/hooks/use-profile-store";
import { Profile } from "@/app/lib/locales/locale";

type ProfileModalProps = {
  profile: Profile;
  open: boolean;
  setOpen: (open: boolean) => void;
};
type Crop = {
  x: number; // x/y are the coordinates of the top/left corner of the cropped area
  y: number;
  width: number; // width of the cropped area
  height: number; // height of the cropped area
};
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
    resolve(image);
  });
export const ProfileModal = (props: ProfileModalProps) => {
  const { profile } = props;
  const params = useParams<{ userid: string }>();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState("");

  const croppedAreaPixelsRef = React.useRef<Crop>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setFile("");
  }, [props.open]);

  const onCropComplete = (_: Crop, croppedAreaPixels: Crop) => {
    croppedAreaPixelsRef.current = croppedAreaPixels;
    console.log(croppedAreaPixelsRef.current);
  };

  const onSubmit = async () => {
    const { x, y, width, height } = croppedAreaPixelsRef.current;

    if (!width || !height || !file) return;

    const img = await createImage(file);

    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // 일단 임시로 고정 사이즈
    canvas.width = 400;
    canvas.height = 600;

    ctx.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const formData = new FormData();
      formData.append("userid", params.userid);
      formData.append("file", blob, "profile.png");

      fetch("/api/upload/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data: { key: string }) => {
          setProfileImageUrl(data.key);
          props.setOpen(false);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);

          props.setOpen(false);
        });
    }, "image/png");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      const reader = new FileReader();
      // Event listener for when the file is read
      reader.onload = function (e) {
        const result = e.target?.result;
        if (typeof result === "string") setFile(result);
      };

      // Read the file as a Data URL (Base64 encoded string)
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DefaultModal
      title={profile.ui_upload_image_title}
      open={props.open}
      closeButtonText={file ? "" : profile.ui_image_upload_cancel_button}
      onClose={() => props.setOpen(false)}
    >
      <div
        className={
          "block h-fit max-h-fit min-h-48 overflow-y-auto lg:max-h-[75vh]"
        }
      >
        {file === "" && (
          <div
            className={
              "flex min-h-52 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-gray-100 text-lg font-semibold hover:border-gray-600 hover:bg-gray-200"
            }
            {...getRootProps()}
          >
            <input {...getInputProps()} accept={"image/*"} />
            {isDragActive ? (
              <p className={"cursor-pointer"}>
                {profile.ui_image_upload_modal_drag_to_here}
              </p>
            ) : (
              <p className={"cursor-pointer"}>
                {profile.ui_image_upload_modal_drag_to_here_or_click}
              </p>
            )}
          </div>
        )}
        {file && (
          <div className={"max-h-screen"}>
            <p className={"mb-6 hidden text-gray-600 lg:block"}>
              {profile.ui_image_upload_modal_zoom_is_available_by_mouse_wheel}
            </p>
            <p className={"mb-6 block text-gray-600 lg:hidden"}>
              {profile.ui_image_upload_modal_zoom_is_available_by_pinch}
            </p>
            <div className={"aspect-video w-full"}>
              <div
                className={
                  "relative mx-auto aspect-auto h-full min-h-fit overflow-auto rounded-md lg:max-w-md"
                }
              >
                <Cropper
                  image={file}
                  crop={crop}
                  zoom={zoom}
                  aspect={2 / 3}
                  zoomWithScroll={true}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className={"flex w-full justify-center"}>
                <div
                  className={
                    "mt-2 flex w-full max-w-md gap-4 px-2 py-4 lg:gap-6 lg:px-10"
                  }
                >
                  <button
                    className="w-1/3 rounded-md bg-gray-500 py-2 text-center text-white hover:bg-gray-700"
                    onClick={() => props.setOpen(false)}
                  >
                    취소
                  </button>
                  <button
                    className="w-2/3 rounded-md bg-indigo-500 py-2 text-center text-white hover:bg-indigo-700"
                    onClick={onSubmit}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultModal>
  );
};
