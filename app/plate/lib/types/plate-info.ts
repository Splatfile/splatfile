import { z } from "zod";

export const PlateLanguageObject = z.enum([
  "USen",
  "EUnl",
  "USfr",
  "EUfr",
  "EUde",
  "EUit",
  "EUru",
  "USes",
  "EUes",
  "KRko",
  "JPja",
]);

export const PlateInfoObject = z.object({
  id: z.string(),
  name: z.string(),
  title: z.object({
    first: z.number(),
    firstString: z.string().optional(),
    last: z.number(),
    lastString: z.string().optional(),
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
  language: PlateLanguageObject.optional(),
});
