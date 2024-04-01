import * as configs from "./configs.ts";
import {
  LangCode,
  MAIN,
  SPECIAL,
  SUB,
  WEAPON_TYPES,
  WeaponType,
} from "./configs.ts";
import { generateLabels } from "./label.ts";
import {
  fetchJsonData,
  generateConstantOutput,
  generateIndex,
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
  const data = mainWeaponInfo
    .map((weaponInfo) => {
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
    })
    .filter((v) => v.innerId < 10000); // Remove test weapons for nintendo developers

  return data;
}

function preprocessSubWeaponData(
  subWeaponInfo: JsonType,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(subWeaponInfo)) {
    throw new Error("subWeaponInfo is not an array");
  }

  const data = subWeaponInfo
    .map((weaponInfo) => {
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
    })
    .filter((v) => v.innerId < 100); // Remove test weapons for nintendo developers

  return data;
}

function preProcessSpecialWeaponData(
  specialWeaponInfo: JsonType,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(specialWeaponInfo)) {
    throw new Error("specialWeaponInfo is not an array");
  }

  const data = specialWeaponInfo
    .map((weaponInfo) => {
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
    })
    .filter((v) => v.innerId < 20); // Remove test weapons for nintendo developers

  return data;
}

async function downloadImageFiles(
  targetPath: string,
  remoteFileBaseUrl: string,
  remoteIdentAndDestFilenames: Array<[string, string]>,
): Promise<string[]> {
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

      return targetPath + destFilename;
    },
  );

  const savedFilePaths: string[] = [];

  for (let i = 0; i < downloadPromises.length; i += 5) {
    savedFilePaths.push(
      ...(await Promise.all(downloadPromises.slice(i, i + 5))),
    );

    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log(
      `${targetPath}: Downloaded ${Math.min(i + 5, downloadPromises.length)}/${
        downloadPromises.length
      } files`,
    );
  }

  return savedFilePaths;
}

async function replaceMaskColorToSomthing(imgPath: string, color: string) {
  // convert origin.webp \
  //   \( +clone xc:"#28a1e1" -channel RGB -clut \)  # 알파레이어를 제외한 부분을 특정 컬러로 채운 이미지를 \
  //   -compose Screen -composite  # Screen Composition 시킨다 \
  //   result.webp
  const imageMagickCommand = new Deno.Command("convert", {
    args: [
      imgPath,
      "(",
      "+clone",
      `xc:${color}`,
      "-channel",
      "RGB",
      "-clut",
      ")",
      "-compose",
      "Screen",
      "-composite",
      imgPath,
    ],
  });

  const { code, stderr } = await imageMagickCommand.output();

  if (code !== 0) {
    console.error(new TextDecoder().decode(stderr));
    throw new Error("Failed to replace mask color");
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
      configs.OUTPUT_WEAPON_TYPE_PREFIX[type],
      weaponInfoByType[type],
    );

  await Promise.all(WEAPON_TYPES.map(_generateConstantOutput));
  await generateIndex(
    WEAPON_TYPES.map((type) => configs.OUTPUT_WEAPON_TYPE_PREFIX[type]),
    configs.OUTPUT_WEAPON_DIR,
  );

  /** --------------------------------------------
   *               download images
   * ---------------------------------------------**/
  const _downloadAndPostprocessFiles = (type: WeaponType) => {
    return downloadImageFiles(
      configs.OUTPUT_IMAGE_DIR_BY_WEAPON_TYPE[type],
      configs.WEAPON_IMAGE_BASEURL_BY_TYPE[type],
      getRemoteIdentAndDestFilenames(weaponInfoByType[type]),
    ).then(async (savedFilePaths) => {
      if (type === MAIN) {
        return;
      }

      await Promise.all(
        savedFilePaths.map((filename) =>
          replaceMaskColorToSomthing(
            filename,
            configs.OUTPUT_SUBSPE_KEY_COLOR[type],
          ),
        ),
      );
    });
  };

  const getRemoteIdentAndDestFilenames = (
    data: Array<PreprocessedWeaponInfo>,
  ) =>
    data.map((v) => [v.remoteImgIdent, `${v.code}.webp`] as [string, string]);

  await Promise.all(WEAPON_TYPES.map(_downloadAndPostprocessFiles));
}
