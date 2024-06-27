"use client";

export async function loadFont(
  fontSize: number,
  fontFamily: string,
  text: string,
) {
  await new Promise((resolve, reject) => {
    if (document.fonts.check(`${fontSize}px ${fontFamily}`, text)) {
      resolve(true);
    } else {
      document.fonts
        .load(`${fontSize}px ${fontFamily}`, text)
        .then(() => {
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });

  await document.fonts.ready;
}

export async function loadImages<T extends string>(
  keyToSrc: Record<T, string>,
  loadCallback: (key: T, image: HTMLImageElement) => void,
): Promise<Record<T, HTMLImageElement>> {
  const keyToImage = {} as Record<T, HTMLImageElement>;

  await Promise.all(
    Object.entries<string>(keyToSrc).map(async ([key, src]) => {
      const image = new Image();
      image.crossOrigin = "anonymous";

      await new Promise((resolve) => {
        image.onload = () => {
          loadCallback(key as T, image);
          resolve(null);
        };
        image.onerror = (e) => {
          resolve(e);
        };
        image.src = src;
      });

      keyToImage[key as T] = image;
    }),
  );

  return keyToImage;
}
