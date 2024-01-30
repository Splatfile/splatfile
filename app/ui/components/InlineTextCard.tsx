import { ReactNode, useState } from "react";
import { PencilIcon } from "@heroicons/react/20/solid";

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

type EditableInlineTextCardProps = InlineTextCardProps & {
  edit: boolean;
  setEdit: (edit: boolean) => void;
};

export function EditableInlineTextCard(props: EditableInlineTextCardProps) {
  const [isMine, setIsMine] = useState(false);

  return (
    <div
      className={
        "flex w-full items-center justify-start gap-4 rounded-md border border-gray-300 bg-white px-4 py-6 drop-shadow-sm md:w-auto md:flex-col md:items-center md:justify-center md:px-4 md:py-12"
      }
    >
      <div className={"flex items-center gap-2"}>
        <h3 className={"text-lg font-bold md:text-xl"}>{props.title}</h3>
        {props.edit ? (
          <button
            className={
              "rounded-md bg-blue-600 px-2 py-0.5 text-sm text-neutral-200"
            }
            onClick={() => props.setEdit(false)}
          >
            완료
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
      <div className={"flex flex-col gap-1 font-semibold text-neutral-700"}>
        {props.children}
      </div>
    </div>
  );
}
