import { ReactNode } from "react";

export type InlineTextCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export function InlineTextCard(props: InlineTextCardProps) {
  return (
    <div
      className={
        "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm md:w-auto md:flex-col md:items-center md:justify-center md:px-4 md:py-12"
      }
    >
      <h3 className={"text-lg font-bold md:text-xl"}>{props.title}</h3>
      <div className={"flex flex-col gap-1 font-semibold text-neutral-700"}>
        {props.children}
      </div>
    </div>
  );
}
