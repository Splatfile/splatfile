import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { EditableInlineTextCard } from "@/app/ui/components/InlineTextCard";
import { EditableText } from "@/app/ui/components/EditableText";

export const SwitchCodeCard = () => {
  const [edit, setEdit] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const friendCode = "1298-1620-0718";
  const qrUrl =
    "https://lounge.nintendo.com/friendcode/1298-1620-0718/DF9vt5MV1G";

  const qrUrlRegex =
    "https://lounge.nintendo.com/friendcode/\\d{4}-\\d{4}-\\d{4}/[A-Za-z0-9]{10}";

  useEffect(() => {
    (async () => {
      setQrCode(await QRCode.toDataURL(qrUrl));
    })();
  }, []);

  return (
    <EditableInlineTextCard title={"친구 코드"} edit={edit} setEdit={setEdit}>
      <EditableText edit={edit} value={friendCode} onChange={() => {}} />

      <div className={"flex"}>
        <div
          className={"hidden  h-20 w-full items-center justify-center md:flex"}
        >
          <img
            className={"m-auto hidden h-full w-20 object-cover md:block"}
            src={qrCode}
            alt={"QR Code"}
          />
        </div>
      </div>
      <a
        className={"text-sm font-medium text-gray-400 md:hidden md:text-center"}
        href="https://lounge.nintendo.com/friendcode/1298-1620-0718/DF9vt5MV1G"
      >
        추가하기
      </a>
    </EditableInlineTextCard>
  );
};
