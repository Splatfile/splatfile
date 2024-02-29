import {
  setTitlePosition,
  useTitlePosition,
} from "../../../lib/store/use-position";

export function TitlePosition() {
  const title = useTitlePosition();
  return (
    <form className={"flex flex-col items-start gap-2"}>
      <h2 className={"text-lg"}>타이틀 위치 조정</h2>
      <div className={"flex gap-2"}>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="title-font-size"
            className="block text-sm font-medium leading-6"
          >
            폰트 사이즈
          </label>
          <input
            type="number"
            name="title-font-size"
            id="title-font-size"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setTitlePosition({
                ...title,
                fontSize: Number(e.target.value),
              });
            }}
            value={title.fontSize}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="title-x"
            className="block text-sm font-medium leading-6"
          >
            가로
          </label>
          <input
            type="number"
            name="title-x"
            id="title-x"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setTitlePosition({
                ...title,
                x: Number(e.target.value),
              });
            }}
            value={title.x}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="title-y"
            className="block text-sm font-medium leading-6"
          >
            세로
          </label>
          <input
            type="number"
            name="title-y"
            id="title-y"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setTitlePosition({
                ...title,
                y: Number(e.target.value),
              });
            }}
            value={title.y}
          />
        </div>
      </div>
    </form>
  );
}
