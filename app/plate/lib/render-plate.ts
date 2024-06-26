import { baseUrl } from "./const";
import { scaleStepByGradientDirection } from "./types/gradient";
import {
  getBadgesPosition,
  getIdPosition,
  getNamePosition,
  getPrintPreview,
  getTagSize,
  getTitlePosition,
} from "./store/use-position";
import { TagState } from "@/app/plate/lib/store/use-tag-store";
import { Lang } from "@/app/lib/types/component-props";

const bannerSrc = (file: string, custom = false) =>
  `${baseUrl}/assets/${custom ? "custom/" : ""}banners/${removeImageExtension(file)}.webp`;

const getXScale = (width: number, max: number) => {
  return width > max ? max / width : 1;
};

const bannerImages: { [key: string]: HTMLImageElement } = {};
const getBannerImage = async (banner: string) => {
  if (!bannerImages[banner]) {
    const image = new Image();
    image.src = bannerSrc(banner);
    bannerImages[banner] = image;

    // create image onload promise
    await new Promise((r) => {
      image.onload = r;
    });
    // resolve promise
    return image;
  }
  return bannerImages[banner];
};

const removeImageExtension = (file: string) => {
  return file.replace(".png", "").replace(".webp", "");
};

const getBadgeImage = async (badge: string) => {
  const image = new Image();
  image.src = `${baseUrl}/assets/badges/${removeImageExtension(badge)}.png`;
  await new Promise((r) => {
    image.onload = r;
  });
  return image;
};

export function isFontLoaded(
  fontName: string,
  fontSize = "16px",
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Check if the font is already loaded
    if (document.fonts.check(fontSize + " " + fontName)) {
      resolve(true);
    } else {
      // Font is not loaded, so listen for the load event
      document.fonts
        .load(fontSize + " " + fontName)
        .then((e) => {
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}

const isSpaceLang = (language: string) => {
  return (
    [
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
    ].indexOf(language) !== -1
  );
};

type PlateLang =
  | "USen"
  | "EUnl"
  | "USfr"
  | "EUfr"
  | "EUde"
  | "EUit"
  | "EUru"
  | "USes"
  | "EUes"
  | "KRko"
  | "JPja";

const titleToString = (language: PlateLang, title: TagState["title"]) => {
  const chosentitles = [];
  if (title.string) chosentitles.push(title.string);
  else {
    if (title.firstString !== "") chosentitles.push(title.firstString);
    if (title.lastString !== "") chosentitles.push(title.lastString);
  }
  if (chosentitles[0])
    return chosentitles.join(
      isSpaceLang(language)
        ? !(chosentitles[0]?.endsWith("-") || chosentitles[1]?.startsWith("-"))
          ? " "
          : ""
        : "",
    );
  else return "";
};

let compositeCanvas: HTMLCanvasElement;
let textCanvas: HTMLCanvasElement;
let canvasLayer: HTMLCanvasElement;

const initCanvases = () => {
  if (!compositeCanvas) {
    compositeCanvas = document.createElement("canvas");
  }
  if (!textCanvas) {
    textCanvas = document.createElement("canvas");
  }
  if (!canvasLayer) {
    canvasLayer = document.createElement("canvas");
  }

  return { compositeCanvas, textCanvas, canvasLayer };
};

const loadFont = async () => {
  await document.fonts.ready;
};

// 현재는 다 똑같은 상태이지만 나중변경을 대비하여 일단 코드 남겨  둠
const textFont = (lang: PlateLang) => {
  switch (lang) {
    case "KRko":
      return `Splat-text, Kurokane, HanyiZongyi, DFPT_AZ5, KERINm`;
    case "JPja":
      return `Splat-text, Kurokane, HanyiZongyi, DFPT_AZ5, KERINm`;
    default:
      return `Splat-text, Kurokane, HanyiZongyi, DFPT_AZ5, KERINm`;
  }
};

const titleFont = (lang: PlateLang) => {
  switch (lang) {
    case "KRko":
      return `Splat-title, Rowdy, DFPT_ZY9, KCUBEr`;
    case "JPja":
      return `Splat-title, Rowdy, DFPT_ZY9, KCUBEr`;
    default:
      return `Splat-title, KCUBEr, Rowdy, HuakangZongyi, DFPT_ZY9`;
  }
};

export const loadFonts = async (plateLang: PlateLang) => {
  await loadFont();
  return (
    (await isFontLoaded(titleFont(plateLang))) &&
    (await isFontLoaded(textFont(plateLang)))
  );
};

export const getPlateLang = (lang: Lang): PlateLang => {
  switch (lang) {
    case "ko":
      return "KRko";
    case "ja":
      return "JPja";
    default:
      return "USen";
  }
};

export const renderPlate = async (
  canvas: HTMLCanvasElement,
  tagState: TagState,
  plateLang: PlateLang = "KRko",
  preview = false,
) => {
  initCanvases();
  await loadFonts(plateLang);
  if (
    !(
      (await isFontLoaded(titleFont(plateLang))) &&
      (await isFontLoaded(textFont(plateLang)))
    )
  ) {
    return;
  }
  let x = 0,
    y = 0,
    w: number,
    h: number;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const textCtx = textCanvas.getContext("2d") as CanvasRenderingContext2D & {
    letterSpacing: string;
  };
  const tagSize = getTagSize();

  if (!preview) {
    w = tagSize.w;
    h = tagSize.h;
  } else {
    w = 350;
    h = 100;
  }

  textCtx.clearRect(x, y, w, h);
  ctx.clearRect(x, y, w, h);

  const {
    banner,
    layers,
    title,
    color,
    bgColours,
    name,
    badges,
    isCustom,
    id,
    isGradient,
    gradientDirection,
  } = tagState;
  console.log("Tagstate", tagState);
  const bannerImage = await getBannerImage(banner);
  compositeCanvas.width = w;
  compositeCanvas.height = h;
  const compositeCtx = compositeCanvas.getContext("2d");
  canvasLayer.width = w;
  canvasLayer.height = h;
  const layerCtx = canvasLayer.getContext("2d");
  ctx.save();
  if (isGradient) {
    // If gradient, draw the gradient then the banner
    const [sx, sy, dx, dy] = scaleStepByGradientDirection(
      gradientDirection,
      w,
      h,
    );

    let gradient = ctx.createLinearGradient(sx, sy, dx, dy);
    if (gradientDirection === "to outside") {
      gradient = ctx.createRadialGradient(sx, sy, 0, dx, dy, w / 2);
    }

    gradient.addColorStop(0, bgColours[0]);
    gradient.addColorStop(0.33, bgColours[1]);
    gradient.addColorStop(0.66, bgColours[2]);
    gradient.addColorStop(1, bgColours[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
  } else if (!layers) {
    // If not one of the special "pick your own colour" banners, just draw it
    ctx.drawImage(bannerImage, x, y, w, h);
  } else {
    // Special custom colour banners draw each layer then are added

    const imageLayers: Array<HTMLImageElement> = [];
    const imagePromises: Array<Promise<unknown>> = [];
    for (let i = 0; i < layers; i++) {
      const layer = new Image();
      const p = new Promise((r) => {
        layer.onload = r;
        layer.src = banner.replace("preview", `${i + 1}`);
      });
      imagePromises.push(p);
      imageLayers.push(layer);
    }
    await Promise.all(imagePromises);

    for (let i = 0; i < imageLayers.length; i++) {
      if (!compositeCtx || !layerCtx) {
        return;
      }
      compositeCtx.clearRect(x, y, w, h);
      compositeCtx.save();
      compositeCtx.fillStyle = bgColours[!i ? i : imageLayers.length - i];
      compositeCtx.drawImage(imageLayers[i], x, y, w, h);
      compositeCtx.globalCompositeOperation = "difference";
      compositeCtx.fillRect(x, y, w, h);
      compositeCtx.restore();

      layerCtx.save();
      layerCtx.drawImage(imageLayers[i], x, y, w, h);
      layerCtx.globalCompositeOperation = "source-in";
      layerCtx.drawImage(compositeCanvas, x, y, w, h);
      layerCtx.restore();
      ctx.drawImage(canvasLayer, x, y);
      layerCtx.clearRect(x, y, w, h);
    }
  }
  ctx.restore();

  /// About Text
  const textScale = 2;
  textCanvas.width = w * textScale;
  textCanvas.height = h * textScale;

  textCtx.scale(textScale, textScale);

  // Set text colour
  textCtx.fillStyle = color;

  // Write titles
  textCtx.textAlign = "left";

  const titlePosition = getTitlePosition();
  if (title) {
    textCtx.save();
    textCtx.font = `${titlePosition.fontSize}px ${textFont(plateLang)}`;
    textCtx.letterSpacing = "-0.3px";
    const textWidth = textCtx.measureText(
      titleToString(plateLang, title),
    ).width;
    const xScale = getXScale(textWidth, w - 32);

    textCtx.transform(1, 0, -7.5 / 100, 1, x, y);
    textCtx.scale(xScale, 1);
    textCtx.fillText(
      titleToString(plateLang, title),
      18 / xScale + titlePosition.x,
      42 + titlePosition.y + (h - 200) / 2,
    );
    textCtx.restore();
    textCtx.letterSpacing = "0px";
  }

  // Write tag text (if not empty)
  const idPosition = getIdPosition();
  if (id.length) {
    textCtx.save();
    textCtx.font = `${idPosition.fontSize}px ${textFont(plateLang)}`;
    textCtx.letterSpacing = "0.2px";

    // tag text should adjust to the leftmost badge position.
    const leftBadge = badges.indexOf(
      badges.find((b) => b !== "") || "No Badge",
    );
    const maxX = (leftBadge === -1 ? w : 480 + 74 * leftBadge) - 48;
    const textWidth = textCtx.measureText(id).width;
    const xScale = getXScale(textWidth, maxX);

    textCtx.scale(xScale, 1);
    textCtx.fillText(
      "" + id,
      24 / xScale + idPosition.x,
      185 + (h - 200) / 2 + idPosition.y,
    );
    textCtx.restore();
  }

  // Write player name
  const namePosition = getNamePosition();

  if (name.length) {
    textCtx.save();
    textCtx.font = `${namePosition.fontSize}px ${titleFont(plateLang)}`;
    textCtx.letterSpacing = "-0.4px";
    const textWidth = textCtx.measureText(name).width;
    const xScale = getXScale(textWidth, w - 32);

    textCtx.textAlign = "center";
    textCtx.scale(xScale, 1);
    textCtx.fillText(
      name,
      (w / 2 - 1.5) / xScale + namePosition.x,
      119 + namePosition.y + (h - 200) / 2,
    );

    textCtx.restore();
  }
  ctx.save();
  ctx.drawImage(textCanvas, x, y, w, h);
  textCtx.clearRect(x, y, w, h);
  ctx.restore();

  // If the banner name or badge has either "custom" or "data" it is definitely a custom resource

  // Draw each badge on the banner
  const badgesPosition = getBadgesPosition();
  for (let i = 0; i < 3; i++) {
    if (badges[i] !== "") {
      const sizeRatio = 1 + 0.02 * badgesPosition.size;
      const x = w - 72 + (i - 2) * (74 * sizeRatio) + badgesPosition.x;
      const badgeImage = await getBadgeImage(badges[i]);

      // Below used to resize custom badges to retain their scale.
      if (isCustom) {
        const cw = badgeImage.naturalWidth;
        const ch = badgeImage.naturalHeight;
        const landscape = cw > ch;

        const sizeRatio = 1 + 0.05 * badgesPosition.size;

        const ratio = !landscape ? cw / ch : ch / cw;
        const width = landscape ? 70 : 70 * ratio * sizeRatio;
        const height = !landscape ? 70 : 70 * ratio * sizeRatio;

        ctx.drawImage(
          badgeImage,
          x + (70 / 2 - width / 2),
          128 + (70 / 2 - height / 2) + (h - 200) / 2,
          width,
          height,
        );
      } else {
        ctx.drawImage(
          badgeImage,
          x,
          128 + badgesPosition.y + (h - 200) / 2,
          70 * sizeRatio,
          70 * sizeRatio,
        );
      }
    }
  }
  ctx.save();

  const printPreview = getPrintPreview();

  // draw a red line, 700, 200 on center
  if (printPreview) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    //draw rectangle on center of canvas (700, 200)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(w / 2 - 350, h / 2 - 100, 700, 200);
    ctx.stroke();
  }

  ctx.drawImage(textCanvas, x, y, w, h);
  ctx.restore();
};
