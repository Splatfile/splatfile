import { PropsWithChildren } from "react";

type LayoutProps = {};

export default function Layout(props: PropsWithChildren<LayoutProps>) {
  return (
    <main
      className={
        "h-full max-w-screen-2xl rounded-2xl bg-white/95 px-2 py-4 md:my-8 md:p-6"
      }
    >
      {props.children}
    </main>
  );
}
