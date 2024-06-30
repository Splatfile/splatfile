import sanitizeHtml from "sanitize-html";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

type EditableTextProps = {
  edit: boolean;
  value: string;
  onChange: (value: string) => void;
  textClassName?: string;
  inputClassName?: string;
  emptytext?: string;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "ref" | "className" | "value" | "onChange"
>;

export const EditableText = forwardRef<HTMLInputElement, EditableTextProps>(
  function EditableText(props, ref) {
    const {
      edit,
      value,
      type,
      onChange,
      textClassName,
      inputClassName,
      placeholder,
      pattern,
      maxLength,
      ...otherProps
    } = props;

    if (edit) {
      return (
        <input
          ref={ref}
          className={inputClassName}
          type={type ?? "text"}
          placeholder={placeholder}
          value={value}
          pattern={pattern}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          {...otherProps}
        />
      );
    }

    if (value) {
      return <p className={textClassName}>{value}</p>;
    } else {
      return (
        <p
          className={clsx(
            textClassName,
            "text-center font-normal text-black opacity-40",
          )}
        >
          {props.emptytext ?? "-"}
        </p>
      );
    }
  },
);

type EditableParagraphProps = Omit<EditableTextProps, "inputClassName"> & {
  cols?: number;
  rows?: number;
  textareaClassName?: string;
};

export function EditableParagraph(props: EditableParagraphProps) {
  const {
    edit,
    value,
    onChange,
    textClassName,
    textareaClassName,
    placeholder,
    cols,
    rows,
  } = props;

  if (edit) {
    return (
      <div className={"block w-full"}>
        <textarea
          className={textareaClassName}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          cols={cols}
        />
      </div>
    );
  }

  if (value) {
    return (
      <p
        className={textClassName}
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(value)
            .replaceAll("\n", "<br>")
            .replaceAll(" ", "&nbsp;"),
        }}
      />
    );
  } else {
    return (
      <p
        className={clsx(
          textClassName,
          "text-center font-normal text-black opacity-40",
        )}
      >
        {props.emptytext ?? "-"}
      </p>
    );
  }
}

type EditableNumberProps = {
  edit: boolean;
  value: string | number;
  onChange: (value: string) => void;
  step?: number;
  min?: number;
  max?: number;
  textClassName?: string;
  inputClassName?: string;
};

export function EditableNumber(props: EditableNumberProps) {
  const {
    edit,
    value,
    onChange,
    textClassName,
    inputClassName,
    min,
    max,
    step,
  } = props;

  if (edit) {
    return (
      <input
        className={inputClassName}
        type={"number"}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return <p className={textClassName}>{value}</p>;
}
