import { z } from "zod";

export const PlateInfoObject = z.object({
  id: z.string(),
  name: z.string(),
  title: z.object({
    first: z.number(),
    last: z.number(),
    string: z.string(),
  }),
  banner: z.string(),
  badges: z.tuple([z.string(), z.string(), z.string()]),
  color: z.string(),
  bgColours: z.tuple([z.string(), z.string(), z.string(), z.string()]),
  isCustom: z.boolean(),
  isGradient: z.boolean(),
  layers: z.number(),
  gradientDirection: z.enum([
    "to top",
    "to bottom",
    "to left",
    "to right",
    "to top left",
    "to top right",
    "to bottom left",
    "to bottom right",
    "to outside",
  ]),
});
