import {
  Gradients,
  setGradient,
  setGradientDirection,
  useGradient,
} from "../../../lib/store/use-tag-store";
import {
  gradientDirectionAngle,
  gradientDirections,
} from "../../../lib/types/gradient";
import { ArrowUpOnSquareIcon } from "@heroicons/react/16/solid";

export const GradientRenderer = () => {
  const gradient = useGradient();
  return (
    <div
      className={"flex w-full flex-col items-center justify-center gap-2 py-2"}
    >
      <p
        id="textColour"
        className={"cursor-pointer text-lg"}
        onClick={() => {
          setGradient([...gradient]);
        }}
      >
        Gradient
      </p>
      <div id="bannercolours" style={{ display: "" }}>
        {gradient.map((color, index) => (
          <input
            key={index}
            type="color"
            value={color}
            onChange={(e) => {
              const newGradients: Gradients = [...gradient];
              newGradients[index] = e.target.value;
              setGradient(newGradients);
            }}
          />
        ))}
      </div>
      <div className={"grid w-20 grid-cols-3 gap-2"}>
        {gradientDirections.map((direction) => {
          if (direction === "to outside") {
            return (
              <button
                key={direction}
                onClick={() => setGradientDirection(direction)}
                className={"h-6 w-6 cursor-pointer overflow-hidden rounded-md"}
                style={{
                  transform: `rotate(${gradientDirectionAngle[direction]}deg)`,
                  background: `radial-gradient(${gradient[0]}, ${gradient[1]}, ${gradient[2]}, ${gradient[3]})`,
                }}
              >
                {/* Circle */}
                <div className={"rounded-full"}>
                  <div
                    className={"h-6 w-6 rounded-full"}
                    style={{
                      background: `radial-gradient(${gradient[0]}, ${gradient[1]}, ${gradient[2]}, ${gradient[3]})`,
                    }}
                  ></div>
                </div>
              </button>
            );
          }
          return (
            <button
              key={direction}
              onClick={() => setGradientDirection(direction)}
              className={"h-6 w-6 cursor-pointer overflow-hidden rounded-md"}
              style={{
                transform: `rotate(${gradientDirectionAngle[direction]}deg)`,
                background: `linear-gradient(0deg, ${gradient[0]} 0%, ${gradient[1]} 33%, ${gradient[2]} 66%, ${gradient[3]} 100%)`,
              }}
            >
              <ArrowUpOnSquareIcon />
            </button>
          );
        })}
      </div>
    </div>
  );
};
