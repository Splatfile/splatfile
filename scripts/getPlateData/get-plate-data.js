const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repositoryUrl = "https://github.com/SeymourSchlong/splashtags";
const cloneDirectory = "splashtags";

console.log("Current path:", __dirname, process.cwd());

const lastIndex = __dirname.lastIndexOf("/");

const dirs = __dirname.split("/");

const dirToRoot = dirs.slice(0, dirs.length - 2);

const rootPath = dirToRoot.join("/");
console.log("Root path:", rootPath);
// 카피할 파일 경로
const cloneDirectoryPath = path.join(__dirname, cloneDirectory);

const sourceFilePath = path.join(cloneDirectoryPath, "assets/");
const publicDirectory = "public";
const publicAssets = path.join(rootPath, publicDirectory, "assets/");

console.log("Remove exist repo");
if (fs.existsSync(cloneDirectoryPath)) {
  // git pull
  console.log("Start pull repository");
  // move to clone directory
  process.chdir(cloneDirectoryPath);
  const childProcess = execSync(`git pull`, (error) => {
    if (error) {
      console.error(`Pulling repository failed: ${error}`);
      return;
    }

    // Pull이 성공적으로 완료된 후 실행됩니다.
    console.log(`Repository pulled successfully`);
  });
  console.log("Process end", childProcess.toString());
} else {
  console.log("Start clone repository");
  const childProcess = execSync(
    `git clone ${repositoryUrl} ${cloneDirectoryPath}`,
    (error) => {
      if (error) {
        console.error(`Cloning repository failed: ${error}`);
        return;
      }

      // Clone이 성공적으로 완료된 후 실행됩니다.
      console.log(`Repository cloned successfully`);

      // 일부 파일을 카피할 디렉토리 생성
    },
  );

  //buffer to string
  console.log("Process end", childProcess.toString());
}

if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory);
}

console.log("Start copy file");
// 파일 카피
fs.cpSync(sourceFilePath, publicAssets, { recursive: true });
fs.cpSync(
  path.join(cloneDirectoryPath, "assets.json"),
  path.join(publicAssets, "assets.json"),
);
fs.cpSync(
  path.join(cloneDirectoryPath, "lang.json"),
  path.join(publicAssets, "lang.json"),
);

console.log("Source:", sourceFilePath, "Destination:", publicAssets);
fs.cpSync(
  path.join(publicAssets, "assets.json"),
  path.join(rootPath, "/app/plate/assets.json"),
);

fs.cpSync(
  path.join(cloneDirectoryPath, "lang.json"),
  path.join(rootPath, "/app/plate/lang.json"),
);
console.log("File copied successfully");

//read lang json file
const json = fs.readFileSync(path.join(cloneDirectoryPath, "/lang.json"));
const lang = JSON.parse(json);

// save lang only KRko
const langKR = lang["KRko"];
const krLang = {
  KRko: langKR,
};
fs.writeFileSync(
  path.join(rootPath, "public/lang.json"),
  JSON.stringify(krLang),
  { encoding: "utf8", flag: "w" },
);
fs.writeFileSync(
  path.join(rootPath, "app/plate/lang.json"),
  JSON.stringify(krLang),
  {
    encoding: "utf8",
    flag: "w",
  },
);

// 클론한 디렉토리 삭제
console.log("Clone directory deleted successfully");
