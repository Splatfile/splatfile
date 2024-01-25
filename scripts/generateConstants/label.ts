import * as configs from "./configs.ts";
import { type LangCode } from "./configs.ts";
import { fetchJsonData, type JsonType } from "./utils.ts";

export async function fetchLabelDataJsonByLangCode() {
  const promises = configs.SUPPORT_LABEL_LANGUAGES.map(
    async (lang) =>
      [
        lang,
        await fetchJsonData(configs.LABEL_DATA_URL_BY_LANG_CODE[lang]),
      ] as const,
  );

  return new Map(await Promise.all(promises));
}

/** ------------------------------------------------------------------------
 *  특정 itemKey의 언어별 라벨을 생성합니다.
 *  ex)
 *    ```
 *    generateLabels("CommonMsg/Weapon/WeaponName_Main", "Blaster_Long_00", labelDataJsonByLangCode)
 *    => {
 *      KRko: "롱블래스터",
 *      JPja: "ロングブラスター",
 *      USen: "Range Blaster"
 *    }
 *   ```
 * ------------------------------------------------------------------------**/
export function generateLabels(
  labelTypeKey: string,
  itemKey: string,
  languageDataJsonByLangCode: Map<LangCode, JsonType>,
) {
  return Object.fromEntries(
    configs.SUPPORT_LABEL_LANGUAGES.map(
      (lang) =>
        [
          lang,
          (
            languageDataJsonByLangCode.get(lang) as Record<
              string,
              Record<string, string>
            >
          )[labelTypeKey][itemKey],
        ] as const,
    ),
  );
}
