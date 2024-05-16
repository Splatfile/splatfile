const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

type LangData = {
  [key: string]: string;
};

const results: {
  [key: string]: LangData;
} = {
  ko: {},
  en: {},
  ja: {},
};

fs.createReadStream(__dirname + "/locales.csv")
  .pipe(csv())
  .on("data", (data: LangData) => {
    const key = data["lang"];
    console.log("data:", data);
    results["ko"][key] = data["ko"] || "";
    results["en"][key] = data["en"] || "";
    results["ja"][key] = data["ja"] || "";
  })
  .on("end", () => {
    saveLangFiles(results);
  });

function saveLangFiles(data: { [key: string]: LangData }) {
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
      if (!separatedObj[key1]) {
        separatedObj[key1] = {};
      }
      separatedObj[key1][key2.join("_")] = obj[key];
    });

    console.log("separatedObj:", separatedObj);

    fs.writeFile(filePath, JSON.stringify(separatedObj, null, 2), (err) => {
      if (err) {
        console.error(`Error writing ${lang}.json:`, err);
      } else {
        console.log(`${lang}.json has been saved.`);
      }
    });
  });
}
