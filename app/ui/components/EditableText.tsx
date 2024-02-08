import { HTMLInputTypeAttribute } from "react";

type EditableTextProps = {
  edit: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  textClassName?: string;
  inputClassName?: string;
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
  } = props;

  if (edit) {
    return (
      <input
        className={inputClassName}
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return <p className={textClassName}>{value}</p>;
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
