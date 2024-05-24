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
          <QueryClientWrapper>
            <UserContextWrapper>{children}</UserContextWrapper>
          </QueryClientWrapper>
        </div>
      </body>
    </html>
  );
}
