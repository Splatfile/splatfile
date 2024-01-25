import { fetchLabelDataJsonByLangCode } from "./label.ts";
import { main as mapMain } from "./map.ts";
import { main as weaponMain } from "./weapon.ts";

async function main() {
  const labelDataJsonByLangCode = await fetchLabelDataJsonByLangCode();

  await mapMain(labelDataJsonByLangCode);
  await weaponMain(labelDataJsonByLangCode);
}

await main();
