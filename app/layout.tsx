import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={""}>
      <body
        className={notoSansKR.className}
        style={{
          backgroundImage: 'url("/background/body.png")',
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <div
          className={
            "min-w-screen min-h-screen bg-black/50 backdrop-blur md:text-lg"
          }
        >
          <UserContextWrapper>{children}</UserContextWrapper>
        </div>
      </body>
    </html>
  );
}
