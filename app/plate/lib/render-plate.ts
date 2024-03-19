import lang from "../lang.json";
import { base } from "./const";
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

const bannerSrc = (file: string, custom = false) =>
  `${base}/assets/${custom ? "custom/" : ""}banners/${file}`;

const language = "KRko";

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

const getBadgeImage = async (badge: string) => {
  const image = new Image();
  image.src = `${base}/assets/badges/${badge}`;
  await new Promise((r) => {
    image.onload = r;
  });
  return image;
};

function isFontLoaded(fontName: string, fontSize = "16px"): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Check if the font is already loaded
    if (document.fonts.check(fontSize + " " + fontName)) {
      resolve(true);
    } else {
      // Font is not loaded, so listen for the load event
      document.fonts
        .load(fontSize + " " + fontName)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
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

const titleToString = (title: TagState["title"]) => {
  const chosentitles = [];
  if (title.string) chosentitles.push(title.string);
  else {
    if (title.first !== -1)
      chosentitles.push(lang[language].titles.first[title.first]);
    if (title.last !== -1)
      chosentitles.push(lang[language].titles.last[title.last]);
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

const textFont = `Splat-text${
  lang[language].font ? "," + lang[language].font[0] : ""
}`;

const titleFont = `Splat-title${
  lang[language].font ? "," + lang[language].font[1] : ""
}`;

export const loadFonts = async () => {
  await loadFont();
  return (await isFontLoaded(titleFont)) && (await isFontLoaded(textFont));
};

export const renderPlate = async (
  canvas: HTMLCanvasElement,
  tagState: TagState,
) => {
  initCanvases();
  await loadFonts();
  if (!((await isFontLoaded(titleFont)) && (await isFontLoaded(textFont)))) {
    return;
  }
  console.log("font loaded");

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const textCtx = textCanvas.getContext("2d") as CanvasRenderingContext2D & {
    letterSpacing: string;
  };
  const tagSize = getTagSize();

  textCtx.clearRect(0, 0, tagSize.w, tagSize.h);
  ctx.clearRect(0, 0, tagSize.w, tagSize.h);

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

  const bannerImage = await getBannerImage(banner);
  compositeCanvas.width = tagSize.w;
  compositeCanvas.height = tagSize.h;
  const compositeCtx = compositeCanvas.getContext("2d");
  canvasLayer.width = tagSize.w;
  canvasLayer.height = tagSize.h;
  const layerCtx = canvasLayer.getContext("2d");
  ctx.save();
  if (isGradient) {
    // If gradient, draw the gradient then the banner
    const [sx, sy, dx, dy] = scaleStepByGradientDirection(
      gradientDirection,
      tagSize.w,
      tagSize.h,
    );

    let gradient = ctx.createLinearGradient(sx, sy, dx, dy);
    if (gradientDirection === "to outside") {
      gradient = ctx.createRadialGradient(sx, sy, 0, dx, dy, tagSize.w / 2);
    }

    gradient.addColorStop(0, bgColours[0]);
    gradient.addColorStop(0.33, bgColours[1]);
    gradient.addColorStop(0.66, bgColours[2]);
    gradient.addColorStop(1, bgColours[3]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, tagSize.w, tagSize.h);
  } else if (!layers) {
    // If not one of the special "pick your own colour" banners, just draw it
    ctx.drawImage(bannerImage, 0, 0, tagSize.w, tagSize.h);
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
      compositeCtx.clearRect(0, 0, tagSize.w, tagSize.h);
      compositeCtx.save();
      compositeCtx.fillStyle = bgColours[!i ? i : imageLayers.length - i];
      compositeCtx.drawImage(imageLayers[i], 0, 0, tagSize.w, tagSize.h);
      compositeCtx.globalCompositeOperation = "difference";
      compositeCtx.fillRect(0, 0, tagSize.w, tagSize.h);
      compositeCtx.restore();

      layerCtx.save();
      layerCtx.drawImage(imageLayers[i], 0, 0, tagSize.w, tagSize.h);
      layerCtx.globalCompositeOperation = "source-in";
      layerCtx.drawImage(compositeCanvas, 0, 0, tagSize.w, tagSize.h);
      layerCtx.restore();
      ctx.drawImage(canvasLayer, 0, 0);
      layerCtx.clearRect(0, 0, tagSize.w, tagSize.h);
    }
  }
  ctx.restore();

  /// About Text
  const textScale = 2;
  textCanvas.width = tagSize.w * textScale;
  textCanvas.height = tagSize.h * textScale;

  textCtx.scale(textScale, textScale);

  // Set text colour
  textCtx.fillStyle = color;

  // Write titles
  textCtx.textAlign = "left";

  const titlePosition = getTitlePosition();
  if (title) {
    textCtx.save();
    textCtx.font = `${titlePosition.fontSize}px ${textFont}`;
    textCtx.letterSpacing = "-0.3px";
    const textWidth = textCtx.measureText(titleToString(title)).width;
    const xScale = getXScale(textWidth, tagSize.w - 32);

    textCtx.transform(1, 0, -7.5 / 100, 1, 0, 0);
    textCtx.scale(xScale, 1);
    textCtx.fillText(
      titleToString(title),
      18 / xScale + titlePosition.x,
      42 + titlePosition.y + (tagSize.h - 200) / 2,
    );
    textCtx.restore();
    textCtx.letterSpacing = "0px";
  }

  // Write tag text (if not empty)
  const idPosition = getIdPosition();
  if (id.length) {
    textCtx.save();
    textCtx.font = `${idPosition.fontSize}px ${textFont}`;
    textCtx.letterSpacing = "0.2px";

    // tag text should adjust to the leftmost badge position.
    const leftBadge = badges.indexOf(
      badges.find((b) => b !== "") || "No Badge",
    );
    const maxX = (leftBadge === -1 ? tagSize.w : 480 + 74 * leftBadge) - 48;
    const textWidth = textCtx.measureText(id).width;
    const xScale = getXScale(textWidth, maxX);

    textCtx.scale(xScale, 1);
    textCtx.fillText(
      "" + id,
      24 / xScale + idPosition.x,
      185 + (tagSize.h - 200) / 2 + idPosition.y,
    );
    textCtx.restore();
  }

  // Write player name
  const namePosition = getNamePosition();

  if (name.length) {
    textCtx.save();
    textCtx.font = `${namePosition.fontSize}px ${titleFont}`;
    textCtx.letterSpacing = "-0.4px";
    const textWidth = textCtx.measureText(name).width;
    const xScale = getXScale(textWidth, tagSize.w - 32);

    textCtx.textAlign = "center";
    textCtx.scale(xScale, 1);
    textCtx.fillText(
      name,
      (tagSize.w / 2 - 1.5) / xScale + namePosition.x,
      119 + namePosition.y + (tagSize.h - 200) / 2,
    );

    textCtx.restore();
  }
  ctx.save();
  ctx.drawImage(textCanvas, 0, 0, tagSize.w, tagSize.h);
  textCtx.clearRect(0, 0, tagSize.w, tagSize.h);
  ctx.restore();

  // If the banner name or badge has either "custom" or "data" it is definitely a custom resource

  // Draw each badge on the banner
  const badgesPosition = getBadgesPosition();
  for (let i = 0; i < 3; i++) {
    if (badges[i] !== "") {
      const sizeRatio = 1 + 0.02 * badgesPosition.size;
      const x = tagSize.w - 72 + (i - 2) * (74 * sizeRatio) + badgesPosition.x;
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
          128 + (70 / 2 - height / 2) + (tagSize.h - 200) / 2,
          width,
          height,
        );
      } else {
        ctx.drawImage(
          badgeImage,
          x,
          128 + badgesPosition.y + (tagSize.h - 200) / 2,
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
    ctx.moveTo(tagSize.w / 2, 0);
    ctx.lineTo(tagSize.w / 2, tagSize.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, tagSize.h / 2);
    ctx.lineTo(tagSize.w, tagSize.h / 2);
    ctx.stroke();

    //draw rectangle on center of canvas (700, 200)
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(tagSize.w / 2 - 350, tagSize.h / 2 - 100, 700, 200);
    ctx.stroke();
  }

  ctx.drawImage(textCanvas, 0, 0, tagSize.w, tagSize.h);
  ctx.restore();
};
