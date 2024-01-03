import { ReactNode } from "react";
import { clsx } from "clsx";

export type TextCardProps = {
  title: ReactNode;
  titleClassName?: string;

  wrapperClassName?: string;
  childrenClassName?: string;
  children: ReactNode;
};

// 모바일에서만 한줄로 보임
export function TextCard(props: TextCardProps) {
  return (
    <div
      className={clsx(
        "flex w-full flex-col items-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm md:w-auto md:items-center md:justify-center md:px-4 md:py-12",
        props.wrapperClassName,
      )}
    >
      <h3
        className={clsx("text-lg font-bold md:text-xl", props.titleClassName)}
      >
        {props.title}
      </h3>
      <div
        className={clsx(
          "flex flex-col gap-2 font-semibold text-neutral-700",
          props.childrenClassName,
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
