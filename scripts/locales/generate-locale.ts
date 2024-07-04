const {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} = require("quicktype-core");

const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

type LangData = {
  [key: string]: string;
};

const results: {
  [key: string]: LangData;
} = {
  types: {},
  ko: {},
  en: {},
  ja: {},
};

fs.createReadStream(__dirname + "/locales.csv")
  .pipe(csv())
  .on("data", (data: LangData) => {
    const key = data["lang"];
    results["types"][key] = key || "";
    results["ko"][key] = data["ko"] || "";
    results["en"][key] = data["en"] || "";
    results["ja"][key] = data["ja"] || "";
  })
  .on("end", async () => {
    await saveLangFiles(results);
    const json = fs.readFileSync(__dirname + "/dist/ko.json", "utf8");
    const type = await quicktypeJSON("typescript", "Locale", json);

    const exportedType = type.lines.join("\n");
    fs.writeFileSync(__dirname + "/dist/locale.d.ts", exportedType);
  });

async function saveLangFiles(data: { [key: string]: LangData }) {
  if (!fs.existsSync(__dirname + "/dist")) {
    fs.mkdirSync(__dirname + "/dist");
  }
  Object.keys(data).forEach((lang) => {
    const filePath = path.join(__dirname, `/dist/${lang}.json`);
    const obj = data[lang];

    const separatedObj: {
      [key: string]: LangData;
    } = {};

    const sepratedKeys = Object.keys(obj);

    sepratedKeys.forEach((key) => {
      const [key1, ...key2] = key.split("_");
      const localeKey = key1 + "Locale";
      if (!separatedObj[localeKey]) {
        separatedObj[localeKey] = {};
      }
      separatedObj[localeKey][key2.join("_")] = obj[key];
    });

    console.log("obj", obj);
    console.log("separatedObj", separatedObj);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
    // if (lang === "types") {
    //   let typeStr = "export type Locale = {\n";
    //   console.log(separatedObj);
    //   const keys = Object.keys(separatedObj);
    //   keys.forEach((key) => {
    //     typeStr += `  ${key}: "${separatedObj.types[key]}";\n`;
    //   });
    //
    //   return;
    // }

    fs.writeFileSync(filePath, JSON.stringify(separatedObj, null, 2));
  });
}

async function quicktypeJSON(
  targetLanguage: string,
  typeName: string,
  jsonString: string,
) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  return await quicktype({
    inputData,
    lang: targetLanguage,
  });
}
