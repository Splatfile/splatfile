import { notoSansKR } from "@/app/fonts";
import "@/app/globals.css";
import type { Metadata } from "next";
import Script from "next/script";

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
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DSG2NFQFWQ"
        ></Script>
        <Script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DSG2NFQFWQ');
          `}
        </Script>
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
            "min-w-screen min-h-screen max-w-full bg-black/50 backdrop-blur md:text-lg"
          }
        >
          {children}
        </div>
      </body>
    </html>
  );
}
