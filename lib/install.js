import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
import { pipeline } from "stream/promises";
import crypto from "crypto";
import * as tar from "tar";
import AdmZip from "adm-zip";
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

async function downloadFile(url, dest) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  await pipeline(response.body, fs.createWriteStream(dest));
}

async function verifyChecksum(filePath, checksumUrl, filename) {
  const response = await fetch(checksumUrl);
  if (!response.ok) {
    throw new Error(`Failed to download checksums: ${response.statusText}`);
  }
  const checksums = await response.text();

  // checksums file format: "sha256  filename"
  const expectedChecksum = checksums
    .split("\n")
    .find((line) => line.endsWith(filename))
    ?.split(/\s+/)[0];

  if (!expectedChecksum) {
    throw new Error(`Checksum for ${filename} not found in checksums file.`);
  }

  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256");
  hash.update(fileBuffer);
  const actualChecksum = hash.digest("hex");

  if (actualChecksum !== expectedChecksum) {
    throw new Error(`Checksum mismatch! Expected ${expectedChecksum}, got ${actualChecksum}`);
  }
}

async function install() {
  try {
    const version = getPkgVersion();
    const releaseFile = getReleaseFilename(version);
    const checksumFile = getChecksumFilename(version);
    const binFile = getBinFilename();

    if (!releaseFile) {
      throw new Error(`Are you sure this platform is supported? See: https://github.com/gohugoio/hugo/releases/tag/v${version}`);
    }

    if (!isExtended(releaseFile)) {
      console.warn(`${logSymbols.info} Hugo Extended isn't supported on this platform, downloading vanilla Hugo instead.`);
    }

    // Prepare vendor directory
    const vendorDir = path.join(__dirname, "..", "vendor");
    if (!fs.existsSync(vendorDir)) {
      fs.mkdirSync(vendorDir, { recursive: true });
    }

    const releaseUrl = getReleaseUrl(version, releaseFile);
    const checksumUrl = getReleaseUrl(version, checksumFile);
    const downloadPath = path.join(vendorDir, releaseFile);

    console.info(`${logSymbols.info} Downloading ${releaseFile}...`);
    await downloadFile(releaseUrl, downloadPath);

    console.info(`${logSymbols.info} Verifying checksum...`);
    await verifyChecksum(downloadPath, checksumUrl, releaseFile);

    if (process.platform === "darwin") {
      console.info(`${logSymbols.info} Installing ${releaseFile} (requires sudo)...`);
      // Run MacOS installer
      const result = spawnSync("sudo", ["installer", "-pkg", downloadPath, "-target", "/"], {
        stdio: "inherit",
      });

      if (result.error) throw result.error;
      if (result.status !== 0) {
        throw new Error(`Installer failed with exit code ${result.status}`);
      }

      // Cleanup downloaded pkg
      fs.unlinkSync(downloadPath);
    } else {
      console.info(`${logSymbols.info} Extracting...`);

      if (releaseFile.endsWith(".zip")) {
        const zip = new AdmZip(downloadPath);
        zip.extractAllTo(vendorDir, true);

        // Cleanup zip
        fs.unlinkSync(downloadPath);
      } else if (releaseFile.endsWith(".tar.gz")) {
        await tar.x({
          file: downloadPath,
          cwd: vendorDir,
        });

        // Cleanup tar.gz
        fs.unlinkSync(downloadPath);
      }

      const binPath = path.join(vendorDir, binFile);
      if (fs.existsSync(binPath)) {
        fs.chmodSync(binPath, 0o755);
      }
    }

    console.info(`${logSymbols.success} Hugo installed successfully!`);

    // Check version
    if (process.platform === "darwin") {
       console.info(getBinVersion("/usr/local/bin/hugo"));
       return "/usr/local/bin/hugo";
    } else {
       const binPath = path.join(vendorDir, binFile);
       console.info(getBinVersion(binPath));
       return binPath;
    }
  } catch (error) {
    console.error(`${logSymbols.error} Hugo installation failed. :(`);
    throw error;
  }
}

export default install;
