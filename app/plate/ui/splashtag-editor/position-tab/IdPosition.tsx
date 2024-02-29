import { setIdPosition, useIdPosition } from "../../../lib/store/use-position";

export function IdPosition() {
  const id = useIdPosition();
  return (
    <form className={"flex flex-col items-start gap-2"}>
      <h2 className={"text-lg"}>ID 위치 조정</h2>
      <div className={"flex gap-2"}>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label
            htmlFor="id-font-size"
            className="block text-sm font-medium leading-6"
          >
            폰트 사이즈
          </label>
          <input
            type="number"
            name="id-font-size"
            id="id-font-size"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setIdPosition({
                ...id,
                fontSize: Number(e.target.value),
              });
            }}
            value={id.fontSize}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label htmlFor="id-x" className="block text-sm font-medium leading-6">
            가로
          </label>
          <input
            type="number"
            name="id-x"
            id="id-x"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setIdPosition({
                ...id,
                x: Number(e.target.value),
              });
            }}
            value={id.x}
          />
        </div>
        <div className={"flex flex-col gap-1 md:flex-row"}>
          <label htmlFor="id-y" className="block text-sm font-medium leading-6">
            세로
          </label>
          <input
            type="number"
            name="id-y"
            id="id-y"
            className={"w-12 pl-2 text-black"}
            onChange={(e) => {
              setIdPosition({
                ...id,
                y: Number(e.target.value),
              });
            }}
            value={id.y}
          />
        </div>
      </div>
    </form>
  );
}
