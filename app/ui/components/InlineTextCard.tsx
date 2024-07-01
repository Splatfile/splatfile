"use client";
import { ReactNode } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { clsx } from "clsx";

export type InlineTextCardProps = {
  title: ReactNode;
  children: ReactNode;
};

export function InlineTextCard(props: InlineTextCardProps) {
  return (
    <div
      className={
        "relative flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white p-4 pt-10 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:w-auto md:flex-col md:items-center md:justify-center md:px-4 md:py-12"
      }
    >
      <h3
        className={
          "absolute left-4 top-2 break-normal text-lg font-bold md:text-xl"
        }
      >
        {props.title}
      </h3>
      <div className={"flex flex-col gap-1 font-semibold text-neutral-700"}>
        {props.children}
      </div>
    </div>
  );
}

type EditableInlineTextCardProps = InlineTextCardProps & {
  edit: boolean;
  setEdit: (edit: boolean) => void;
  childrenClassName?: string;
};

export function EditableInlineTextCard(props: EditableInlineTextCardProps) {
  const { isMine } = useEditStore();

  return (
    <div
      className={
        "relative flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-5 pt-10 drop-shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md md:w-auto md:flex-col md:items-center md:justify-center md:px-4"
      }
    >
      <div
        className={clsx(
          "absolute left-4 top-2 flex items-center gap-2 md:flex-row",
          {
            "flex-col": props.edit,
            "flex-row": !props.edit,
          },
        )}
      >
        <h3 className={"break-keep text-lg font-bold md:text-xl"}>
          {props.title}
        </h3>
        {props.edit ? (
          <button
            className={
              "rounded-md bg-blue-600 px-2 py-0.5 text-sm text-neutral-200 hover:bg-blue-700"
            }
            onClick={() => props.setEdit(false)}
          >
            확인
          </button>
        ) : (
          isMine && (
            <button
              className={"h-4 w-4 text-neutral-500"}
              onClick={() => props.setEdit(true)}
            >
              <PencilIcon />
            </button>
          )
        )}
      </div>
      <div
        className={clsx(
          "flex flex-col gap-1 font-semibold text-neutral-700",
          props.childrenClassName,
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
