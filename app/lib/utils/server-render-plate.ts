import lang from "@/app/plate/lang.json";
import { baseUrl } from "@/app/plate/lib/const";
import { scaleStepByGradientDirection } from "@/app/plate/lib/types/gradient";
import {
  getBadgesPosition,
  getIdPosition,
  getNamePosition,
  getPrintPreview,
  getTagSize,
  getTitlePosition,
} from "@/app/plate/lib/store/use-position";
import { TagState } from "@/app/plate/lib/store/use-tag-store";
import {
  Canvas,
  CanvasRenderingContext2D,
  Image,
  loadImage,
  registerFont,
} from "canvas";

const bannerSrc = (file: string, custom = false) =>
  `/assets/${custom ? "custom/" : ""}banners/${file}`;

const language = "KRko";

const getXScale = (width: number, max: number) => {
  return width > max ? max / width : 1;
};

const bannerImages: { [key: string]: Image } = {};
const getBannerImage = async (banner: string) => {
  if (!bannerImages[banner]) {
    const image = await loadImage(baseUrl + bannerSrc(banner));

    bannerImages[banner] = image;

    // create image onload promise
    // resolve promise
    return image;
  }
  return bannerImages[banner];
};

const getBadgeImage = async (badge: string) => {
  return await loadImage(`${baseUrl}/assets/badges/${badge}`);
};

async function isFontLoaded() {
  registerFont("public/assets/fonts/SplatoonTitle.otf", {
    family: "Splat-title",
    style: "normal",
    weight: "normal",
  });

  registerFont("public/assets/fonts/SplatoonText.otf", {
    family: "Splat-text",
    style: "normal",
    weight: "normal",
  });

  registerFont("public/assets/fonts/KRko/AsiaKERIN-M.otf", {
    family: "KERINm",
    style: "normal",
    weight: "normal",
  });

  registerFont("public/assets/fonts/KRko/AsiaKERIN-M.otf", {
    family: "KCUBEr",
    style: "normal",
    weight: "normal",
  });
  return true;
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

let compositeCanvas: Canvas;
let textCanvas: Canvas;
let canvasLayer: Canvas;

const initCanvases = () => {
  if (!compositeCanvas) {
    compositeCanvas = new Canvas(700, 200);
  }
  if (!textCanvas) {
    textCanvas = new Canvas(700, 200);
  }
  if (!canvasLayer) {
    canvasLayer = new Canvas(700, 200);
  }

  return { compositeCanvas, textCanvas, canvasLayer };
};

const textFont = lang[language].font
  ? `,"${lang[language].font[0]}"`
  : "Splat-text";

const titleFont = lang[language].font
  ? `,"${lang[language].font[1]}"`
  : "Splat-title";

export const loadFonts = async () => {
  return await isFontLoaded();
};

export const renderServerPlate = async (
  canvas: Canvas,
  tagState: TagState,
  preview = false,
) => {
  initCanvases();
  await loadFonts();

  console.log("font loaded");
  let x = 0,
    y = 0,
    w: number,
    h: number;

  const ctx = canvas.getContext("2d");
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
  const bannerImage = await getBannerImage(banner);
  console.log("loaded");

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

    const imageLayers: Array<Image> = [];

    for (let i = 0; i < layers; i++) {
      const layer = await loadImage(banner.replace("preview", `${i + 1}`));
      imageLayers.push(layer);
    }

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
    textCtx.font = `${titlePosition.fontSize}px ${titleFont}`;
    console.log("titleFont", titleFont);
    textCtx.letterSpacing = "-0.3px";
    const textWidth = textCtx.measureText(titleToString(title)).width;
    const xScale = getXScale(textWidth, w - 32);

    textCtx.transform(1, 0, -7.5 / 100, 1, x, y);
    textCtx.scale(xScale, 1);
    textCtx.fillText(
      titleToString(title),
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

    textCtx.font = `${idPosition.fontSize}px ${textFont}`;
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
    textCtx.font = `${namePosition.fontSize}px ${titleFont}`;
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
