import {
  setBadgesPosition,
  useBadgesPosition,
} from "../../../lib/store/use-position";

export function BadgePosition() {
  const badges = useBadgesPosition();
  return (
    <form className={"flex flex-col items-start gap-2"}>
      <h2 className={"text-lg"}>배지 위치 조정</h2>
      <div className={"flex flex-col gap-1 md:flex-row"}>
        <div className={"flex gap-2"}>
          <div className={"flex flex-col gap-1 md:flex-row"}>
            <label
              htmlFor="badge-size"
              className="block text-sm font-medium leading-6"
            >
              배지 크기
            </label>
            <input
              type="number"
              name="badge-size"
              id="badge-size"
              className={"w-12 pl-2 text-black"}
              onChange={(e) => {
                setBadgesPosition({
                  ...badges,
                  size: Number(e.target.value),
                });
              }}
              value={badges.size}
            />
          </div>
        </div>

        <div className={"flex gap-2"}>
          <div className={"flex flex-col gap-1 md:flex-row"}>
            <label
              htmlFor="badge-x"
              className="block text-sm font-medium leading-6"
            >
              가로
            </label>
            <input
              type="number"
              name="badge-x"
              id="badge-x"
              className={"w-12 pl-2 text-black"}
              onChange={(e) => {
                setBadgesPosition({
                  ...badges,
                  x: Number(e.target.value),
                });
              }}
              value={badges.x}
            />
          </div>
          <div className={"flex flex-col gap-1 md:flex-row"}>
            <label
              htmlFor="badge-y"
              className="block text-sm font-medium leading-6"
            >
              세로
            </label>
            <input
              type="number"
              name="badge-y"
              id="badge-y"
              className={"w-12 pl-2 text-black"}
              onChange={(e) => {
                setBadgesPosition({
                  ...badges,
                  y: Number(e.target.value),
                });
              }}
              value={badges.y}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
