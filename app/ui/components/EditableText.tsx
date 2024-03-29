import { HTMLInputTypeAttribute } from "react";
import sanitizeHtml from "sanitize-html";

type EditableTextProps = {
  edit: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;

  textClassName?: string;
  inputClassName?: string;
  pattern?: string;
};

export function EditableText(props: EditableTextProps) {
  const {
    edit,
    value,
    type,
    onChange,
    textClassName,
    inputClassName,
    placeholder,
    pattern,
  } = props;

  if (edit) {
    return (
      <input
        className={inputClassName}
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        pattern={pattern}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return <p className={textClassName}>{value}</p>;
}

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
