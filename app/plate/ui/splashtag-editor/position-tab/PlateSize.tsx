import { setTagSize, useTagSize } from "../../../lib/store/use-position";
import { useEffect } from "react";

export const PlateSize = () => {
  const tagSize = useTagSize();

  useEffect(() => {
    const { w, h } = tagSize;

    const t = setTimeout(() => {
      if (w < 600 || w > 800 || h < 150 || h > 250) {
        const width = w < 600 ? 600 : w > 800 ? 800 : w;
        const height = h < 150 ? 150 : h > 250 ? 250 : h;
        setTagSize({
          w: width,
          h: height,
        });
      }
    }, 2000);

    return () => clearTimeout(t);
  }, [tagSize]);

  return (
    <div className={"flex flex-col items-start  gap-2"}>
      <h2 className={"text-lg"}>플레이트 사이즈</h2>
      <div className={"flex gap-2"}>
        <div className={"flex flex-col gap-2 sm:flex-row"}>
          <label
            htmlFor="tag-width"
            className="block text-sm font-medium leading-6"
          >
            가로 (600~800)
          </label>
          <input
            type="number"
            name="tag-width"
            id="tag-width"
            className={"w-20 pl-2 text-black"}
            min={600}
            max={800}
            onChange={(e) => {
              const w = Number(e.target.value);
              setTagSize({
                w,
                h: tagSize.h,
              });
            }}
            value={tagSize.w}
          />
        </div>
        <div className={"flex flex-col gap-2 sm:flex-row"}>
          <label
            htmlFor="tag-height"
            className="block text-sm font-medium leading-6"
          >
            세로 (150~250)
          </label>
          <input
            type="number"
            name="tag-height"
            id="tag-height"
            min={150}
            max={250}
            className={"w-20 pl-2 text-black"}
            onChange={(e) => {
              const h = Number(e.target.value);
              setTagSize({
                w: tagSize.w,
                h,
              });
            }}
            value={tagSize.h}
          />
        </div>
      </div>
    </div>
  );
};
