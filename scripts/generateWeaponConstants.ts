// constant를 적절히 수정 후 다음과 같은 커맨드 실행
// deno run --allow-net --allow-write --allow-run scripts/generateWeaponConstants.ts

const MAIN = "main";
const SUB = "sub";
const SPECIAL = "special";
const CODES = [MAIN, SUB, SPECIAL] as const;
type Code = typeof CODES[number];

/** ------------------------------------------------------------------------
 *                         data source definitions
 * ------------------------------------------------------------------------**/
const TARGET_VERSION = "600"; // ex. 600 => v6.0.0
const SUPPORT_LABEL_LANGUAGES = ["KRko", "JPja", "USen"] as const;
type LangCode = typeof SUPPORT_LABEL_LANGUAGES[number];

const WEAPON_INFO_BASE_URL =
  `https://raw.githubusercontent.com/Leanny/splat3/main/data/mush/${TARGET_VERSION}/`;
const WEAPON_INFO_URL_BY_CODE = {
  [MAIN]: WEAPON_INFO_BASE_URL + "WeaponInfoMain.json",
  [SUB]: WEAPON_INFO_BASE_URL + "WeaponInfoSub.json",
  [SPECIAL]: WEAPON_INFO_BASE_URL + "WeaponInfoSpecial.json",
} as const;

const WEAPON_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/Leanny/splat3/main/images/";
const WEAPON_IMAGE_URL_BY_CODE = {
  [MAIN]: WEAPON_IMAGE_BASE_URL + "weapon_flat/",
  [SUB]: WEAPON_IMAGE_BASE_URL + "subspe/",
  [SPECIAL]: WEAPON_IMAGE_BASE_URL + "subspe/",
} as const;

const LANGUAGE_DATA_BASE_URL =
  "https://raw.githubusercontent.com/Leanny/splat3/main/data/language/";
const LANGUAGE_DATA_URL_BY_LANG_CODE = Object.fromEntries(
  SUPPORT_LABEL_LANGUAGES.map(
    (lang) => [lang, LANGUAGE_DATA_BASE_URL + `${lang}_full_unicode.json`],
  ),
);

const LANGUAGE_LABEL_KEY_BY_CODE = {
  [MAIN]: "CommonMsg/Weapon/WeaponName_Main",
  [SUB]: "CommonMsg/Weapon/WeaponName_Sub",
  [SPECIAL]: "CommonMsg/Weapon/WeaponName_Special",
};

/** ------------------------------------------------------------------------
 *                           output definitions
 * ------------------------------------------------------------------------**/

const OUTPUT_CONSTANT_FILENAME_BY_CODE = {
  [MAIN]: "app/lib/constants/weapons/mains.ts",
  [SUB]: "app/lib/constants/weapons/subs.ts",
  [SPECIAL]: "app/lib/constants/weapons/specials.ts",
} as const;

const OUTPUT_IMAGE_DIR_BY_CODE = {
  [MAIN]: "public/ingames/weapons/mains/",
  [SUB]: "public/ingames/weapons/subs/",
  [SPECIAL]: "public/ingames/weapons/specials/",
} as const;

/**=========================  definition end =============================**/

type JsonType = string | number | boolean | null | JsonType[] | {
  [key: string]: JsonType;
};

type PreprocessedWeaponInfo = {
  code: string;
  labels: Record<LangCode, string>;
  innerId: number;
  remoteImgIdent: string;
  subWeapon?: string;
  specialWeapon?: string;
};

async function fetchJsonData(url: string): Promise<JsonType> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

function generateLabels(
  code: Code,
  weaponCode: string,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  const labelKey = LANGUAGE_LABEL_KEY_BY_CODE[code];
  return Object.fromEntries(
    SUPPORT_LABEL_LANGUAGES.map(
      (lang) =>
        [
          lang,
          (
            languageDataJsonByLangCode.get(lang) as Record<
              string,
              Record<string, string>
            >
          )[labelKey][weaponCode],
        ] as const,
    ),
  );
}

function preprocessMainWeaponInfo(
  mainWeaponInfo: JsonType,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(mainWeaponInfo)) {
    throw new Error("mainWeaponInfo is not an array");
  }

  const parseSubSpeName = (val: string) => val.split(".")[0].substring(10); // Work/Gyml/LineMarker.spl__WeaponInfoSub.gyml => LineMarker
  const data = mainWeaponInfo.map(
    (weaponInfo) => {
      weaponInfo = weaponInfo as { [key: string]: JsonType };
      const weaponCode = weaponInfo["__RowId"] as string;

      return {
        code: weaponCode, // Blaster_Long_00
        labels: generateLabels(MAIN, weaponCode, languageDataJsonByLangCode),
        innerId: weaponInfo["Id"] as number, // 220
        subWeapon: parseSubSpeName(weaponInfo["SubWeapon"] as string),
        specialWeapon: parseSubSpeName(weaponInfo["SpecialWeapon"] as string),
        remoteImgIdent: `Path_Wst_${weaponInfo["__RowId"]}.webp`,
      } as PreprocessedWeaponInfo;
    },
  ).filter((v) => (v.innerId < 10000)); // Remove test weapons for nintendo developers

  return data;
}

function preprocessSubWeaponData(
  subWeaponInfo: JsonType,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(subWeaponInfo)) {
    throw new Error("subWeaponInfo is not an array");
  }

  const data = subWeaponInfo.map(
    (weaponInfo) => {
      weaponInfo = weaponInfo as { [key: string]: JsonType };

      return {
        code: weaponInfo["__RowId"] as string, // Beacon
        labels: generateLabels(
          SUB,
          weaponInfo["__RowId"] as string,
          languageDataJsonByLangCode,
        ),
        innerId: weaponInfo["Id"] as number, // 8
        remoteImgIdent: `Wsb_${weaponInfo["__RowId"]}00.png`,
      } as PreprocessedWeaponInfo;
    },
  ).filter((v) => (v.innerId < 100)); // Remove test weapons for nintendo developers

  return data;
}

function preProcessSpecialWeaponData(
  specialWeaponInfo: JsonType,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(specialWeaponInfo)) {
    throw new Error("specialWeaponInfo is not an array");
  }

  const data = specialWeaponInfo.map(
    (weaponInfo) => {
      weaponInfo = weaponInfo as { [key: string]: JsonType };

      return {
        code: weaponInfo["__RowId"] as string, // UltraStamp
        labels: generateLabels(
          SPECIAL,
          weaponInfo["__RowId"] as string,
          languageDataJsonByLangCode,
        ),
        innerId: weaponInfo["Id"] as number, // 8
        remoteImgIdent: `Wsp_${weaponInfo["__RowId"]}00.png`,
      } as PreprocessedWeaponInfo;
    },
  ).filter((v) => (v.innerId < 20)); // Remove test weapons for nintendo developers

  return data;
}

async function generateWeaponConstantOutput(
  targetFilename: string,
  data: Array<PreprocessedWeaponInfo>,
) {
  let resultSrcText =
    "// This file is auto-generated by scripts/generateWeaponConstants.ts\n\n";

  resultSrcText += "export const codes = [\n";
  resultSrcText += data.map((v) => `  "${v.code}", // ${v.labels.KRko}\n`).join(
    "",
  );
  resultSrcText += "] as const;\n\n";

  resultSrcText += "export const codeToData = {\n";
  resultSrcText += data.map((v) => {
    const dataObjectText = JSON.stringify(v).slice(1, -1);
    return `  "${v.code}": {\n${dataObjectText}  },\n`;
  }).join("");
  resultSrcText += "} as const;\n\n";

  await Deno.writeTextFile(targetFilename, resultSrcText);
  await new Deno.Command("deno", { args: ["fmt", targetFilename] }).output();
}

async function downloadImageFiles(
  targetPath: string,
  remoteFileBaseUrl: string,
  remoteIdentAndDestFilenames: Array<[string, string]>,
) {
  await Deno.remove(targetPath, { recursive: true });
  await Deno.mkdir(targetPath);

  const downloadPromises = remoteIdentAndDestFilenames.map(
    async ([remoteIdent, destFilename]) => {
      const response = await fetch(remoteFileBaseUrl + remoteIdent);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch ${remoteIdent}: ${response.status} ${response.statusText}`,
        );
      }
      const imgBlob = await response.blob();
      await Deno.writeFile(
        targetPath + destFilename,
        new Uint8Array(await imgBlob.arrayBuffer()),
      );
    },
  );

  for (let i = 0; i < downloadPromises.length; i += 5) {
    await Promise.all(downloadPromises.slice(i, i + 5));
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(
      `${targetPath}: Downloaded ${
        Math.min(i + 5, downloadPromises.length)
      }/${downloadPromises.length} files`,
    );
  }
}

async function main() {
  /** ============================================
   *                 fetch data
   * =============================================**/
  const weaponInfoJsonByCode = {
    [MAIN]: await fetchJsonData(WEAPON_INFO_URL_BY_CODE[MAIN]),
    [SUB]: await fetchJsonData(WEAPON_INFO_URL_BY_CODE[SUB]),
    [SPECIAL]: await fetchJsonData(WEAPON_INFO_URL_BY_CODE[SPECIAL]),
  };

  const languageDataJsonByLangCode = new Map(
    await Promise.all(
      SUPPORT_LABEL_LANGUAGES.map(
        async (
          lang,
        ) =>
          [
            lang,
            await fetchJsonData(LANGUAGE_DATA_URL_BY_LANG_CODE[lang]),
          ] as const,
      ),
    ),
  );

  /** --------------------------------------------
   *           generate constant data
   * ---------------------------------------------**/
  const [mainWeaponInfo, subWeaponInfo, specialWeaponInfo] = [
    preprocessMainWeaponInfo(
      weaponInfoJsonByCode[MAIN],
      languageDataJsonByLangCode,
    ),
    preprocessSubWeaponData(
      weaponInfoJsonByCode[SUB],
      languageDataJsonByLangCode,
    ),
    preProcessSpecialWeaponData(
      weaponInfoJsonByCode[SPECIAL],
      languageDataJsonByLangCode,
    ),
  ];

  await Promise.all(
    [
      generateWeaponConstantOutput(
        OUTPUT_CONSTANT_FILENAME_BY_CODE[MAIN],
        mainWeaponInfo,
      ),
      generateWeaponConstantOutput(
        OUTPUT_CONSTANT_FILENAME_BY_CODE[SUB],
        subWeaponInfo,
      ),
      generateWeaponConstantOutput(
        OUTPUT_CONSTANT_FILENAME_BY_CODE[SPECIAL],
        specialWeaponInfo,
      ),
    ],
  );

  /** --------------------------------------------
   *               download images
   * ---------------------------------------------**/
  const getRemoteIdentAndDestFilenames = (
    data: Array<PreprocessedWeaponInfo>,
  ) => (
    data.map((v) => [v.remoteImgIdent, `${v.code}.webp`] as [string, string])
  );

  await Promise.all(
    [
      downloadImageFiles(
        OUTPUT_IMAGE_DIR_BY_CODE[MAIN],
        WEAPON_IMAGE_URL_BY_CODE[MAIN],
        getRemoteIdentAndDestFilenames(mainWeaponInfo),
      ),
      downloadImageFiles(
        OUTPUT_IMAGE_DIR_BY_CODE[SUB],
        WEAPON_IMAGE_URL_BY_CODE[SUB],
        getRemoteIdentAndDestFilenames(subWeaponInfo),
      ),
      downloadImageFiles(
        OUTPUT_IMAGE_DIR_BY_CODE[SPECIAL],
        WEAPON_IMAGE_URL_BY_CODE[SPECIAL],
        getRemoteIdentAndDestFilenames(specialWeaponInfo),
      ),
    ],
  );
}

await main();
