import {
  Banner,
  DefinedBanner,
  isBannerItem,
  isBannerTitle,
} from "./types/banner";

export function defineBanners(banners: Banner[]) {
  const definedBanners: DefinedBanner = {};
  let name: string = "";
  for (let i = 0; i < banners.length; i++) {
    const b = banners[i];
    if (isBannerTitle(b)) {
      name = b.name as string;
    } else if (isBannerItem(b)) {
      if (!definedBanners[name]) {
        definedBanners[name] = [];
      }
      definedBanners[name].push(b);
    }
  }
  return definedBanners;
}
