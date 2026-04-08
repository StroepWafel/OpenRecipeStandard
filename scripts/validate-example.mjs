import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const schemaPath = path.join(root, "schemas", "open-recipe.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const examplesDir = path.join(root, "examples");
const files = fs
  .readdirSync(examplesDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

let failed = false;
for (const file of files) {
  const dataPath = path.join(examplesDir, file);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  if (!validate(data)) {
    console.error(`FAIL: ${file}`);
    console.error(validate.errors);
    failed = true;
  } else {
    console.log(`OK: examples/${file}`);
  }
}

if (failed) {
  process.exit(1);
}
console.log(`All ${files.length} example(s) validate against ${path.relative(root, schemaPath)}.`);
