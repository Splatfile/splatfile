import type { Metadata } from "next";
import { Header } from "@/app/(main-views)/users/[userid]/profile/components/Header";
import { Footer } from "@/app/ui/components/Footer";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {};

type RootLayoutProps = {
  searchParams: {
    q?: string;
  };
};

export default function RootLayout(props: PropsWithChildren<RootLayoutProps>) {
  return (
    <>
      <Header q={props.searchParams.q} />
      <div className="flex min-h-screen flex-col items-center justify-start gap-8 shadow-lg">
        <main>{props.children}</main>
      </div>
      <Footer />
    </>
  );
}
