import { ReactNode } from "react";
import { clsx } from "clsx";
import { useEditStore } from "@/app/lib/hooks/use-profile-store";
import { PencilIcon } from "@heroicons/react/20/solid";

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

export type EditableTextCardProps = TextCardProps & {
  edit: boolean;
  setEdit: (edit: boolean) => void;
};

export function EditableTextCard(props: EditableTextCardProps) {
  const { isMine } = useEditStore();

  return (
    <div
      className={clsx(
        "flex w-full flex-col items-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm md:w-auto md:items-center md:justify-center md:px-4 md:py-12",
        props.wrapperClassName,
      )}
    >
      <div
        className={clsx(
          "flex w-full items-center justify-center gap-2 text-center md:flex-row",
          {
            "flex-col": props.edit,
            "flex-row": !props.edit,
          },
        )}
      >
        <h3
          className={clsx("text-lg font-bold md:text-xl", props.titleClassName)}
        >
          {props.title}
        </h3>
        {props.edit ? (
          <button
            className={
              "rounded-md bg-blue-600 px-2 py-0.5 text-sm text-neutral-200"
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
          "flex flex-col gap-2 font-semibold text-neutral-700",
          props.childrenClassName,
        )}
      >
        {props.children}
      </div>
    </div>
  );
}
