import path from "path";
import { fileURLToPath } from "url";
import { getBinFilename } from "./lib/utils.js";

// https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#what-do-i-use-instead-of-__dirname-and-__filename
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hugo = path.join(
  __dirname,
  "vendor",
  getBinFilename(),
);

// The only thing this module really exports is the absolute path to Hugo:
export default hugo;
