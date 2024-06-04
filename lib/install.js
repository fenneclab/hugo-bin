import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import downloader from "careful-downloader";
import logSymbols from "log-symbols";
import {
  getPkgVersion,
  getReleaseUrl,
  getReleaseFilename,
  getBinFilename,
  getBinVersion,
  getChecksumFilename,
  isExtended,
} from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function install() {
  try {
    const version = getPkgVersion();
    const releaseFile = getReleaseFilename(version);
    const checksumFile = getChecksumFilename(version);
    const binFile = getBinFilename();

    // stop here if there's nothing we can download
    if (!releaseFile)
      throw new Error(`Are you sure this platform is supported? See: https://github.com/gohugoio/hugo/releases/tag/v${version}`);

    // warn if platform doesn't support Hugo Extended, proceed with vanilla Hugo
    if (!isExtended(releaseFile))
      console.warn(`${logSymbols.info} Hugo Extended isn't supported on this platform, downloading vanilla Hugo instead.`);

    // download release from GitHub and verify its checksum
    const download = await downloader(getReleaseUrl(version, releaseFile), {
      checksumUrl: getReleaseUrl(version, checksumFile),
      filename: releaseFile,
      destDir: path.join(__dirname, "..", "vendor"),
      algorithm: "sha256",
      extract: true,
    });

    // full path to the binary
    const installedToPath = path.join(download, binFile);

    // ensure hugo[.exe] is executable
    fs.chmodSync(installedToPath, 0o755);

    console.info(`${logSymbols.success} Hugo installed successfully!`);
    console.info(getBinVersion(installedToPath));

    // return the full path to our Hugo binary
    return installedToPath;
  } catch (error) {
    // pass whatever error occurred along the way to console
    console.error(`${logSymbols.error} Hugo installation failed. :(`);
    throw error;
  }
}

export default install;
