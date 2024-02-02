import * as configs from "./configs.ts";
import {
  BATTLE_MAP,
  LangCode,
  MAP_TYPES,
  MapType,
  SALMONRUN_MAP,
} from "./configs.ts";
import { generateLabels } from "./label.ts";
import {
  fetchJsonData,
  generateConstantOutput,
  generateIndex,
  type JsonType,
} from "./utils.ts";

type PreprocessedMapInfo = {
  code: string;
  labels: Record<LangCode, string>;
};

function preprocessBattleMapInfo(
  mapInfoJson: JsonType,
  labelDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(mapInfoJson)) {
    throw new Error("mapInfoJson is not an array");
  }

  const data = mapInfoJson.map((mapInfo) => {
    mapInfo = mapInfo as { [key: string]: JsonType };

    const raw_code = mapInfo["__RowId"] as string;

    let code: string;
    if (/\d$/.test(raw_code)) {
      // 숫자로 끝나는지 검사
      //몇몇 예외를 제외하고, 맵은 리뉴얼을 하는경우가 있어서 id 뒤에 버저닝이 붙는다. 이를 제거한다
      code = raw_code.slice(4, -2); // Vss_Hiagari04  => Hiagari
    } else {
      code = raw_code.slice(4); // Vss_Yagara  => Yagara
    }

    return {
      code: code, // Hiagari
      labels: generateLabels(
        configs.LABEL_KEY_BY_TYPE[BATTLE_MAP],
        code,
        labelDataJsonByLangCode,
      ),
    } as PreprocessedMapInfo;
  });

  return data;
}

function preprocessSalmonrunMapInfo(
  mapInfoJson: JsonType,
  labelDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  if (!Array.isArray(mapInfoJson)) {
    throw new Error("mapInfoJson is not an array");
  }

  const data = mapInfoJson
    .filter(
      (mapInfo) => (mapInfo as Record<string, boolean>)["IsBigRun"] === false,
    ) // 빅런은 제외
    .map((mapInfo) => {
      mapInfo = mapInfo as { [key: string]: JsonType };

      const code = (mapInfo["__RowId"] as string).slice(4); // Cop_Shakelift  => Shakelift

      return {
        code: code, // Shakelift
        labels: generateLabels(
          configs.LABEL_KEY_BY_TYPE[SALMONRUN_MAP],
          code,
          labelDataJsonByLangCode,
        ),
      } as PreprocessedMapInfo;
    });

  return data;
}

export async function main(labelDataJsonByLangCode: Map<LangCode, JsonType>) {
  const mapInfoJsonByType = {
    [BATTLE_MAP]: await fetchJsonData(configs.MAP_INFO_URL_BY_TYPE[BATTLE_MAP]),
    [SALMONRUN_MAP]: await fetchJsonData(
      configs.MAP_INFO_URL_BY_TYPE[SALMONRUN_MAP],
    ),
  } as const;

  const mapInfoByType = {
    [BATTLE_MAP]: preprocessBattleMapInfo(
      mapInfoJsonByType[BATTLE_MAP],
      labelDataJsonByLangCode,
    ),
    [SALMONRUN_MAP]: preprocessSalmonrunMapInfo(
      mapInfoJsonByType[SALMONRUN_MAP],
      labelDataJsonByLangCode,
    ),
  } as const;

  const _generateConstantOutput = (type: MapType) =>
    generateConstantOutput(
      configs.OUTPUT_CONSTANT_FILENAME_BY_TYPE[type],
      configs.OUTPUT_MAP_TYPE_PREFIX[type],
      mapInfoByType[type],
    );

  await Promise.all(MAP_TYPES.map(_generateConstantOutput));

  await generateIndex(
    MAP_TYPES.map((type) => configs.OUTPUT_MAP_TYPE_PREFIX[type]),
    configs.OUTPUT_MAP_DIR,
  );
}
