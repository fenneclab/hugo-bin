import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import { readPackageUpSync } from "read-pkg-up";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This package's version number (should) always match the Hugo release we want.
// We check for a `hugoVersion` field in package.json just in case it doesn't
// match in the future (from pushing an emergency package update, etc.).
export function getPkgVersion() {
  const { packageJson } = readPackageUpSync({ cwd: __dirname });
  return packageJson.hugoVersion || packageJson.version;
}

// Generate the full GitHub URL to a given release file.
export function getReleaseUrl(version, filename) {
  return `https://github.com/gohugoio/hugo/releases/download/v${version}/${filename}`;
}

// Binary is named `hugo.exe` on Windows, and simply `hugo` otherwise.
export function getBinFilename() {
  return process.platform === "win32" ? "hugo.exe" : "hugo";
}

// Simple shortcut to ./vendor/hugo[.exe] from package root.
export function getBinPath() {
  return path.join(
    __dirname,
    "..",
    "vendor",
    getBinFilename(),
  );
}

// Returns the output of the `hugo version` command, i.e.:
//   "hugo v0.88.1-5BC54738+extended darwin/arm64 BuildDate=..."
export function getBinVersion(bin) {
  const stdout = execFileSync(bin, ["version"]);
  return stdout.toString().trim();
}

// Simply detect if the given file exists.
export function doesBinExist(bin) {
  try {
    if (fs.existsSync(bin)) {
      return true;
    }
  } catch (error) {
    // something bad happened besides Hugo not existing
    if (error.code !== "ENOENT") {
      throw error;
    }

    return false;
  }
}

// Hugo Extended supports: macOS x64, macOS ARM64, Linux x64, Windows x64.
// all other combos fall back to vanilla Hugo. There are surely much better ways
// to do this but this is easy to read/update. :)
export function getReleaseFilename(version) {
  const { platform, arch } = process;

  const filename =
    // macOS
    platform === "darwin" ?
      `hugo_extended_${version}_macOS-all.tar.gz` :

    // Windows
    platform === "win32" && arch === "x64" ?
      `hugo_extended_${version}_Windows-64bit.zip` :
    platform === "win32" && arch.endsWith("32") ?
      `hugo_${version}_Windows-32bit.zip` :
    platform === "win32" && "arm" ?
      `hugo_${version}_Windows-ARM.zip` :

    // Linux
    platform === "linux" && arch === "x64" ?
      `hugo_extended_${version}_Linux-64bit.tar.gz` :
    platform === "linux" && arch.endsWith("32") ?
      `hugo_${version}_Linux-32bit.tar.gz` :
    platform === "linux" && arch === "arm" ?
      `hugo_${version}_Linux-ARM.tar.gz` :
    platform === "linux" && arch === "arm64" ?
      `hugo_${version}_Linux-ARM64.tar.gz` :

    // FreeBSD
    platform === "freebsd" && arch === "x64" ?
      `hugo_${version}_FreeBSD-64bit.tar.gz` :

    // OpenBSD
    platform === "openbsd" && arch === "x64" ?
      `hugo_${version}_OpenBSD-64bit.tar.gz` :

    // not gonna work :(
    null;

  return filename;
}

// Simple formula for the checksums.txt file.
export function getChecksumFilename(version) {
  return `hugo_${version}_checksums.txt`;
}

// Check if Hugo extended is being downloaded (as opposed to plain Hugo) based on the release filename.
export function isExtended(releaseFile) {
  return releaseFile.startsWith("hugo_extended_");
}
