import * as configs from "./configs.ts";
import { LangCode, MAIN, SPECIAL, SUB, WeaponType } from "./configs.ts";
import { generateLabels } from "./label.ts";
import {
  fetchJsonData,
  generateConstantOutput,
  type JsonType,
} from "./utils.ts";

type PreprocessedWeaponInfo = {
  code: string;
  labels: Record<LangCode, string>;
  innerId: number;
  remoteImgIdent: string;
  subWeapon?: string;
  specialWeapon?: string;
};

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
        labels: generateLabels(
          configs.LABEL_KEY_BY_TYPE[MAIN],
          weaponCode,
          languageDataJsonByLangCode,
        ),
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
          configs.LABEL_KEY_BY_TYPE[SUB],
          weaponInfo["__RowId"] as string,
          languageDataJsonByLangCode,
        ),
        innerId: weaponInfo["Id"] as number, // 8
        remoteImgIdent: `Wsb_${weaponInfo["__RowId"]}00.webp`,
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
          configs.LABEL_KEY_BY_TYPE[SPECIAL],
          weaponInfo["__RowId"] as string,
          languageDataJsonByLangCode,
        ),
        innerId: weaponInfo["Id"] as number, // 8
        remoteImgIdent: `Wsp_${weaponInfo["__RowId"]}00.webp`,
      } as PreprocessedWeaponInfo;
    },
  ).filter((v) => (v.innerId < 20)); // Remove test weapons for nintendo developers

  return data;
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

export async function main(labelDataJsonByLangCode: Map<LangCode, JsonType>) {
  /** ============================================
   *                 fetch data
   * =============================================**/

  const weaponInfoJsonByType = {
    [MAIN]: await fetchJsonData(configs.WEAPON_INFO_URL_BY_TYPE[MAIN]),
    [SUB]: await fetchJsonData(configs.WEAPON_INFO_URL_BY_TYPE[SUB]),
    [SPECIAL]: await fetchJsonData(configs.WEAPON_INFO_URL_BY_TYPE[SPECIAL]),
  };

  /** --------------------------------------------
   *           generate constant data
   * ---------------------------------------------**/
  const weaponInfoByType = {
    [MAIN]: preprocessMainWeaponInfo(
      weaponInfoJsonByType[MAIN],
      labelDataJsonByLangCode,
    ),
    [SUB]: preprocessSubWeaponData(
      weaponInfoJsonByType[SUB],
      labelDataJsonByLangCode,
    ),
    [SPECIAL]: preProcessSpecialWeaponData(
      weaponInfoJsonByType[SPECIAL],
      labelDataJsonByLangCode,
    ),
  };

  const _generateConstantOutput = (type: WeaponType) =>
    generateConstantOutput(
      configs.OUTPUT_CONSTANT_FILENAME_BY_TYPE[type],
      weaponInfoByType[type],
    );
  await Promise.all(
    [
      _generateConstantOutput(MAIN),
      _generateConstantOutput(SUB),
      _generateConstantOutput(SPECIAL),
    ],
  );

  /** --------------------------------------------
   *               download images
   * ---------------------------------------------**/
  const _downloadImageFiles = (type: WeaponType) =>
    downloadImageFiles(
      configs.OUTPUT_IMAGE_DIR_BY_WEAPON_TYPE[type],
      configs.WEAPON_IMAGE_BASEURL_BY_TYPE[type],
      getRemoteIdentAndDestFilenames(weaponInfoByType[type]),
    );

  const getRemoteIdentAndDestFilenames = (
    data: Array<PreprocessedWeaponInfo>,
  ) => (
    data.map((v) => [v.remoteImgIdent, `${v.code}.webp`] as [string, string])
  );

  await Promise.all(
    [
      _downloadImageFiles(MAIN),
      _downloadImageFiles(SUB),
      _downloadImageFiles(SPECIAL),
    ],
  );
}
