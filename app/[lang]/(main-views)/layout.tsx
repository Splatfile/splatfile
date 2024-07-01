import type { Metadata } from "next";
import { Header } from "@/app/[lang]/(main-views)/users/[userid]/profile/components/Header";
import { Footer } from "@/app/ui/components/Footer";
import { ErrorToast } from "@/app/ui/components/ErrorToast";
import { UserContextWrapper } from "@/app/lib/hooks/user-context-wrapper";

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserContextWrapper>
        <Header />
      </UserContextWrapper>
      <div className="flex min-h-screen flex-col items-center justify-start gap-8 shadow-lg">
        <main>{children}</main>
        <ErrorToast />
      </div>
      <Footer />
    </>
  );
}
