import type { Metadata } from "next";
import { Header } from "@/app/(main-views)/users/[userid]/profile/components/Header";
import { Footer } from "@/app/ui/components/Footer";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col items-center justify-start gap-8 shadow-lg">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
