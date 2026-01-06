import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readPackageUpSync } from "read-package-up";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// This package's version number (should) always match the Hugo release we want.
// We check for a `hugoVersion` field in package.json just in case it doesn't
// match in the future (from pushing an emergency package update, etc.).
export function getPkgVersion(): string {
  const result = readPackageUpSync({ cwd: __dirname });
  if (!result) {
    throw new Error("Could not find package.json");
  }
  const { packageJson } = result;
  return (
    (packageJson as { hugoVersion?: string; version: string }).hugoVersion ||
    packageJson.version
  );
}

// Generate the full GitHub URL to a given release file.
export function getReleaseUrl(version: string, filename: string): string {
  return `https://github.com/gohugoio/hugo/releases/download/v${version}/${filename}`;
}

// Binary is named `hugo.exe` on Windows, and simply `hugo` otherwise.
export function getBinFilename(): string {
  return process.platform === "win32" ? "hugo.exe" : "hugo";
}

// Simple shortcut to ./bin/hugo[.exe] from package root.
export function getBinPath(): string {
  if (process.platform === "darwin") return "/usr/local/bin/hugo";

  return path.join(__dirname, "..", "..", "bin", getBinFilename());
}

// Returns the output of the `hugo version` command, i.e.:
//   "hugo v0.88.1-5BC54738+extended darwin/arm64 BuildDate=..."
export function getBinVersion(bin: string): string {
  const stdout = execFileSync(bin, ["version"]);
  return stdout.toString().trim();
}

// Simply detect if the given file exists.
export function doesBinExist(bin: string): boolean {
  try {
    if (fs.existsSync(bin)) {
      return true;
    }
  } catch (error: unknown) {
    // something bad happened besides Hugo not existing
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code !== "ENOENT"
    ) {
      throw error;
    }

    return false;
  }
  return false;
}

// Hugo Extended supports: macOS x64 / ARM64, Linux x64 / ARM64, Windows x64.
// All other combos fall back to vanilla Hugo. There are surely much better ways
// to do this but this is easy to read/update. :)
export function getReleaseFilename(version: string): string | null {
  const { platform, arch } = process;

  const filename =
    // macOS: as of 0.102.0, binaries are universal
    platform === "darwin" && arch === "x64"
      ? `hugo_extended_${version}_darwin-universal.pkg`
      : platform === "darwin" && arch === "arm64"
        ? `hugo_extended_${version}_darwin-universal.pkg`
        : // Windows
          platform === "win32" && arch === "x64"
          ? `hugo_extended_${version}_windows-amd64.zip`
          : platform === "win32" && arch === "arm64"
            ? `hugo_${version}_windows-arm64.zip`
            : // Linux
              platform === "linux" && arch === "x64"
              ? `hugo_extended_${version}_linux-amd64.tar.gz`
              : platform === "linux" && arch === "arm64"
                ? `hugo_extended_${version}_linux-arm64.tar.gz`
                : // FreeBSD
                  platform === "freebsd" && arch === "x64"
                  ? `hugo_${version}_freebsd-amd64.tar.gz`
                  : // OpenBSD
                    platform === "openbsd" && arch === "x64"
                    ? `hugo_${version}_openbsd-amd64.tar.gz`
                    : // not gonna work :(
                      null;

  return filename;
}

// Simple formula for the checksums.txt file.
export function getChecksumFilename(version: string): string {
  return `hugo_${version}_checksums.txt`;
}

// Check if Hugo extended is being downloaded (as opposed to plain Hugo) based on the release filename.
export function isExtended(releaseFile: string): boolean {
  return releaseFile.startsWith("hugo_extended_");
}
