import path from "path";
import { fileURLToPath } from "url";

// https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#what-do-i-use-instead-of-__dirname-and-__filename
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hugo = path.join(
  __dirname,
  "vendor",
  process.platform === "win32" ? "hugo.exe" : "hugo",
);

export default hugo;
