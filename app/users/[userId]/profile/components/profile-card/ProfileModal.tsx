import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DefaultModal } from "@/app/ui/components/DefaultModal";
import Cropper from "react-easy-crop";

type ProfileModalProps = {
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
    canvas.width = 540;
    canvas.height = 960;

    ctx.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob
    canvas.toBlob(function (blob) {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      //TODO : URL 수정
      fetch("/", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
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
      title={"사진 업로드"}
      open={props.open}
      closeButtonText={file ? "" : "취소"}
      onClose={() => props.setOpen(false)}
    >
      <div className={"block h-fit"}>
        {file === "" && (
          <div
            className={
              "flex min-h-52 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-gray-100 text-lg font-semibold hover:border-gray-600 hover:bg-gray-200"
            }
            {...getRootProps()}
          >
            <input {...getInputProps()} accept={"image/*"} />
            {isDragActive ? (
              <p className={"cursor-pointer"}>파일을 여기에 드래그 해주세요.</p>
            ) : (
              <p className={"cursor-pointer"}>
                파일을 드래그 하거나 클릭하여 선택해 주세요.
              </p>
            )}
          </div>
        )}
        {file && (
          <div className={"max-h-screen"}>
            <p className={"mb-6 hidden text-gray-600 lg:block"}>
              스크롤을 통해 확대 축소가 가능합니다
            </p>
            <p className={"mb-6 block text-gray-600 lg:hidden"}>
              두 손가락 터치로 크기조절 가능합니다.
            </p>
            <div className={"aspect-video max-h-80 w-full"}>
              <div
                className={
                  "relative mx-auto aspect-auto h-full min-h-fit overflow-auto rounded-md lg:max-w-md"
                }
              >
                <Cropper
                  image={file}
                  crop={crop}
                  zoom={zoom}
                  aspect={9 / 16}
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
                    className="w-2/3 rounded-md bg-indigo-500 py-2 text-center text-white hover:bg-indigo-700"
                    onClick={onSubmit}
                  >
                    확인
                  </button>
                  <button
                    className="w-1/3 rounded-md bg-gray-500 py-2 text-center text-white hover:bg-gray-700"
                    onClick={() => props.setOpen(false)}
                  >
                    취소
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
