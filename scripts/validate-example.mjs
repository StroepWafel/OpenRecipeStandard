import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const schema = JSON.parse(
  fs.readFileSync(path.join(root, "schemas", "open-recipe.schema.json"), "utf8")
);
const data = JSON.parse(
  fs.readFileSync(path.join(root, "examples", "minimal-recipe.json"), "utf8")
);

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(data)) {
  console.error(validate.errors);
  process.exit(1);
}
console.log("OK: examples/minimal-recipe.json validates against schemas/open-recipe.schema.json");
