import { useEffect, useState } from "react";
import {
  setColor,
  setId,
  setName,
  setTitle,
  useColor,
  useId,
  useName,
  useTitle,
} from "../../lib/store/use-tag-store";
import { Lang } from "@/app/lib/types/component-props";
import { getLanguage } from "../SplatPlateEditor";
import langs from "../../lang.json";

type TextTabProps = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const getLanguageText = (lang: Lang) => {
  switch (lang) {
    case "en":
      return "English";
    case "ko":
      return "한국어";
    case "ja":
      return "日本語";
  }
  return "";
};

const getLanguageLocale = (lang: Lang) => {
  switch (lang) {
    case "en":
      return "Language";
    case "ko":
      return "언어";
    case "ja":
      return "言語";
  }
  return "";
};

export function TextTab(props: TextTabProps) {
  const { lang, setLang } = props;
  const [customTitle, setCustomTitle] = useState(false);
  const [loading, setLoading] = useState(true);
  const { firstString, lastString, string } = useTitle();
  const name = useName();
  const color = useColor();
  const id = useId();

  useEffect(() => {
    langs[getLanguage(lang)].titles.first.sort();
    langs[getLanguage(lang)].titles.last.sort();
    setLoading(false);
  }, [lang]);

  const onCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle({
      string: e.target.value,
    });
  };

  const setFirst = (firstTitle: string) => {
    setTitle({
      firstString: firstTitle,
      string: "",
    });
  };

  const setLast = (lastTitle: string) => {
    setTitle({
      lastString: lastTitle,
      string: "",
    });
  };

  if (loading) return <div></div>;
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-start p-2 text-white sm:p-4 md:px-8"
      data-name="text"
    >
      <div className="flex max-h-[calc(100vh-120px)]  w-full flex-col justify-start overflow-y-scroll md:gap-4">
        <div>
          <div className={"flex items-center justify-start gap-2"}>
            <p className={"my-2"}>{getLanguageLocale(lang)}:</p>
            <select
              value={lang}
              onChange={({ target: { value } }) => setLang(value as Lang)}
              className={"h-7 rounded-md px-2 text-black"}
            >
              {["en", "ko", "ja"].map((l, i) => (
                <option key={i} value={l}>
                  {getLanguageText(l as Lang)}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full text-start">
            <p className="my-2">{langs[getLanguage(lang)].ui.textName}: </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:flex-row">
            {/* change to react style*/}
            <div>
              <input
                id="nameinput"
                type="text"
                maxLength={10000}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Player"
                className={"h-8 w-40 rounded-md px-2 text-black sm:py-1"}
              />
            </div>
            <div className={"flex gap-2"}>
              <input
                type="text"
                value={id}
                placeholder="#0001"
                onChange={(e) => {
                  setId(e.target.value);
                }}
                maxLength={10000}
                className={
                  "h-8 w-32 rounded-md px-2 text-black sm:w-24 sm:py-1"
                }
              />
              <div
                className={
                  "h-8 w-8 rounded-md border border-gray-300 sm:h-8 sm:w-8"
                }
              >
                <input
                  className={
                    "h-full w-full overflow-hidden rounded-md p-0 text-black"
                  }
                  id="customcolour"
                  type="color"
                  onChange={(e) => {
                    setColor(e.target.value);
                    console.log(e.target.value);
                  }}
                  value={color}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={"py-2"}>
          <div className={"flex items-center gap-3"}>
            <p className={"my-2"}>{langs[getLanguage(lang)].ui.textTitles}: </p>
            <label>
              <small className={"flex items-center gap-2 pt-2"}>
                <span id="textCustom">Custom</span>{" "}
                <input
                  id="customcheck"
                  type="checkbox"
                  checked={customTitle}
                  className={"text-black"}
                  onChange={({ target: { checked } }) =>
                    setCustomTitle(checked)
                  }
                  style={{ verticalAlign: "text-bottom" }}
                />
              </small>
            </label>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            {customTitle ? (
              <input
                value={string}
                onChange={onCustomTitleChange}
                placeholder="Custom Title"
                type="text"
                maxLength={120}
                className="h-8 w-full rounded-md px-2 text-black"
              />
            ) : (
              <>
                <select
                  className="rounded-md px-2 text-black"
                  value={firstString}
                  onChange={({ target: { value } }) => {
                    setFirst(value);
                  }}
                >
                  {langs[getLanguage(lang)].titles.first.map((title, i) => (
                    <option key={i} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-md px-2 text-black"
                  value={lastString}
                  onChange={({ target: { value } }) => {
                    setLast(value);
                  }}
                >
                  {langs[getLanguage(lang)].titles.last.map((title, i) => (
                    <option key={i} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
