import {
  setNamePosition,
  useNamePosition,
} from "../../../lib/store/use-position";

export function NamePosition() {
  const name = useNamePosition();
  return (
    <form className={"flex flex-col items-start gap-2"}>
      <h2 className={"text-lg"}>플레이어명 위치 조정</h2>
      <div className={"flex gap-2"}>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="name-font-size"
            className="block text-sm font-medium leading-6"
          >
            폰트 사이즈
          </label>
          <input
            type="number"
            id={"name-font-size"}
            name="name-font-size"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setNamePosition({
                ...name,
                fontSize: Number(e.target.value),
              });
            }}
            value={name.fontSize}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="name-x"
            className="block text-sm font-medium leading-6"
          >
            가로
          </label>
          <input
            type="number"
            id={"name-x"}
            name="name-x"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setNamePosition({
                ...name,
                x: Number(e.target.value),
              });
            }}
            value={name.x}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="name-y"
            className="block text-sm font-medium leading-6"
          >
            세로
          </label>
          <input
            type="number"
            name="name-y"
            id={"name-y"}
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setNamePosition({
                ...name,
                y: Number(e.target.value),
              });
            }}
            value={name.y}
          />
        </div>
      </div>
    </form>
  );
}
