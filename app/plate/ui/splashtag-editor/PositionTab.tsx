import { PlateSize } from "./position-tab/PlateSize";
import { TitlePosition } from "./position-tab/TitlePosition";
import { IdPosition } from "./position-tab/IdPosition";
import { NamePosition } from "./position-tab/NamePosition";
import { BadgePosition } from "./position-tab/BadgePosition";
import {
  resetTagPosition,
  setPrintPreview,
  setPrintTagPosition,
  usePrintPreview,
} from "../../lib/store/use-position";

export function PositionTab() {
  const printPreview = usePrintPreview();
  return (
    <div
      className={"flex h-full flex-col gap-8 overflow-y-scroll p-4 text-white"}
    >
      <div className={"flex flex-col gap-4 sm:flex-row sm:items-center"}>
        <button
          onClick={resetTagPosition}
          className={
            "rounded-md border border-gray-600 bg-gray-700 px-4 py-2 hover:bg-opacity-80"
          }
        >
          기본값으로 지정
        </button>
        <button
          onClick={setPrintTagPosition}
          className={
            "rounded-md border border-gray-600 bg-gray-700 px-4 py-2 hover:bg-opacity-80"
          }
        >
          인쇄용으로 지정
        </button>
        <div className={"flex justify-center gap-2"}>
          <p>프린트 예상 미리보기</p>
          <input
            type={"checkbox"}
            checked={printPreview}
            onClick={() => setPrintPreview(!printPreview)}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-8 md:flex-row md:gap-12"}>
        <PlateSize />
      </div>
      <div className={"flex flex-col gap-8 lg:flex-row lg:gap-12"}>
        <NamePosition />
      </div>
      <div className={"flex flex-col gap-8 lg:flex-row lg:gap-12"}>
        <TitlePosition />
        <IdPosition />
      </div>
      <div className={"flex flex-col gap-8 lg:flex-row lg:gap-12"}>
        <BadgePosition />
      </div>
    </div>
  );
}
