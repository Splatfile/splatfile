export type GradientDirection =
  | "to top"
  | "to bottom"
  | "to left"
  | "to right"
  | "to top left"
  | "to top right"
  | "to bottom left"
  | "to bottom right"
  | "to outside";

export const scaleStepByGradientDirection = (
  gradientDirection: GradientDirection,
  x: number,
  y: number,
) => {
  if (gradientDirection === "to top") {
    return [x / 2, y, x / 2, 0];
  }
  if (gradientDirection === "to bottom") {
    return [x / 2, 0, x / 2, y];
  }
  if (gradientDirection === "to left") {
    return [x, y / 2, 0, y / 2];
  }
  if (gradientDirection === "to right") {
    return [0, y / 2, x, y / 2];
  }
  if (gradientDirection === "to top left") {
    return [x, y, 0, 0];
  }
  if (gradientDirection === "to top right") {
    return [0, y, x, 0];
  }
  if (gradientDirection === "to bottom left") {
    return [x, 0, 0, y];
  }
  if (gradientDirection === "to bottom right") {
    return [0, 0, x, y];
  }

  if (gradientDirection === "to outside") {
    return [x / 2, y / 2, x / 2, y / 2];
  }

  return [x, y, 0, 0];
};

export const gradientDirectionAngle: Record<GradientDirection, number> = {
  "to top": 0,
  "to bottom": 180,
  "to left": 270,
  "to right": 90,
  "to outside": 0, // "to outside" is a special case, it's not a real gradient direction, it's just "to top
  "to top left": 315,
  "to top right": 45,
  "to bottom left": 225,
  "to bottom right": 135,
};

export const gradientDirections: GradientDirection[] = [
  "to top left",
  "to top",
  "to top right",
  "to left",
  "to outside",
  "to right",
  "to bottom left",
  "to bottom",
  "to bottom right",
];
