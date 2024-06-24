import { notoSansKR } from "@/app/fonts";
import "@/app/globals.css";
import { QueryClientWrapper } from "@/app/lib/hooks/query-client-wrapper";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={""}>
      <head>
        <link
          rel="preload"
          href="/assets/fonts/SplatoonText.otf"
          as="font"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/assets/fonts/SplatoonTitle.otf"
          as="font"
          type="font/otf"
        />

        <link
          rel="preload"
          href="/assets/fonts/JPja/Kurokane.otf"
          as="font"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/assets/fonts/JPja/Rowdy.otf"
          as="font"
          type="font/otf"
        />

        <link
          rel="preload"
          href="/assets/fonts/KRko/AsiaKCUBE-R.otf"
          as="font"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/assets/fonts/KRko/AsiaKERIN-M.otf"
          as="font"
          type="font/otf"
        />

        <link
          rel="preload"
          href="/assets/fonts/TWzh/DFPT_AZ5.otf"
          as="font"
          type="font/otf"
        />
        <link
          rel="preload"
          href="/assets/fonts/TWzh/DFPT_ZY9.otf"
          as="font"
          type="font/otf"
        />

        <link
          rel="preload"
          href="/assets/fonts/CNzh/hanyi_zongyi.ttf"
          as="font"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/assets/fonts/CNzh/huakang_xinzongyi.ttc"
          as="font"
          type="font/ttc"
        />
      </head>
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
          <QueryClientWrapper>
            <UserContextWrapper>{children}</UserContextWrapper>
          </QueryClientWrapper>
        </div>
      </body>
    </html>
  );
}
