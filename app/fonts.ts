import { Jua, Noto_Sans_KR } from "next/font/google";

export const jua = Jua({
  subsets: ["latin"],
  weight: ["400"],
});

export const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
