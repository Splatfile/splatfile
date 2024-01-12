import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/app/users/[userId]/profile/components/Header";

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
    <html lang="en" className={"md:text-lg"}>
      <body
        className={notoSansKR.className}
        style={{
          backgroundImage: 'url("/background/body.png")',
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
        }}
      >
        <div className={"bg-black/50 backdrop-blur"}>
          <Header />
          <div className="flex min-h-screen flex-col items-center justify-start gap-8 p-1 shadow-lg md:p-8">
            <main
              className={
                "h-full max-w-screen-2xl rounded-2xl bg-white/95 px-2 py-4 md:p-6"
              }
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
