import { PropsWithChildren } from "react";

type LayoutProps = {};

export default function Layout(props: PropsWithChildren<LayoutProps>) {
  return (
    <main
      className={
        "h-full w-full rounded-2xl bg-white/95 py-4 sm:max-w-screen-xl md:my-8 md:p-6"
      }
    >
      {props.children}
    </main>
  );
}
