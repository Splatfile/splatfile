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
import lang from "../../lang.json";

const langs = lang["KRko"];

export function TextTab() {
  const [customTitle, setCustomTitle] = useState(false);
  const [loading, setLoading] = useState(true);
  const { first, last, string } = useTitle();
  const name = useName();
  const color = useColor();
  const id = useId();

  useEffect(() => {
    langs.titles.first.sort();
    langs.titles.last.sort();
    setLoading(false);
  }, []);

  const onCustomTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle({
      string: e.target.value,
    });
  };

  const setFirst = (index: number) => {
    setTitle({
      first: index,
      string: "",
    });
  };

  const setLast = (index: number) => {
    setTitle({
      last: index,
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
          <div className="w-full text-start">
            <p className="my-2">{langs.ui.textName}: </p>
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
            <p className={"my-2"}>별명: </p>
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
                  value={first}
                  onChange={({ target: { selectedIndex } }) => {
                    setFirst(selectedIndex);
                  }}
                >
                  {langs.titles.first.map((title, i) => (
                    <option key={i} value={i}>
                      {title}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-md px-2 text-black"
                  value={last}
                  onChange={({ target: { selectedIndex } }) => {
                    setLast(selectedIndex);
                  }}
                >
                  {langs.titles.last.map((title, i) => (
                    <option key={i} value={i}>
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
