import path from "path";
import fs from "fs";
import { execFileSync } from "child_process";
import { readPackageUpAsync } from "read-pkg-up";
import downloader from "careful-downloader";
import chalk from "chalk";

installHugo()
  .then((bin) => {
    // try querying hugo's version via CLI
    const stdout = execFileSync(bin, ["version"]);
    return stdout.toString();
  })
  .then((version) => {
    // print output of `hugo version` to console
    console.log(chalk.green("✔ Hugo installed successfully!"));
    console.log(version);
  })
  .catch((error) => {
    // pass whatever error occured along the way to console
    console.error(chalk.red("✖ Hugo installation failed. :("));
    throw error;
  });

async function installHugo() {
  // this package's version number (should) always match the Hugo release we want
  const { version } = (await readPackageUpAsync()).packageJson;
  const downloadBaseUrl = `https://github.com/gohugoio/hugo/releases/download/v${version}/`;
  const releaseFile = getArchiveFilename(version, process.platform, process.arch);
  const checksumFile = `hugo_${version}_checksums.txt`;
  const binFile = process.platform === "win32" ? "hugo.exe" : "hugo";

  // stop here if there's nothing we can download
  if (!releaseFile) {
    throw new Error(`Are you sure this platform is supported? See: https://github.com/gohugoio/hugo/releases/tag/v${version}`);
  }

  const download = await downloader(
    `${downloadBaseUrl}${releaseFile}`,
    `${downloadBaseUrl}${checksumFile}`,
    {
      filename: releaseFile,
      destDir: "vendor",
      cleanDestDir: false,
      algorithm: "sha256",
      encoding: "binary",
      extract: true,
    },
  );

  // ensure hugo[.exe] is executable
  fs.chmodSync(path.join(download, binFile), 0o755);

  // return the full path to our Hugo binary
  return path.join(download, binFile);
}

// Hugo Extended supports: macOS x64, macOS ARM64, Linux x64, Windows x64.
// all other combos fall back to vanilla Hugo. there are surely much better ways
// to do this but this is easy to read/update. :)
function getArchiveFilename(version, os, arch) {
  const filename =
    // macOS
    os === "darwin" && arch === "x64" ?
      `hugo_extended_${version}_macOS-64bit.tar.gz` :
    os === "darwin" && arch === "arm64" ?
      `hugo_extended_${version}_macOS-ARM64.tar.gz` :

    // Windows
    os === "win32" && arch === "x64" ?
      `hugo_extended_${version}_Windows-64bit.zip` :
    os === "win32" && arch.endsWith("32") ?
      `hugo_${version}_Windows-32bit.zip` :
    os === "win32" && "arm" ?
      `hugo_${version}_Windows-ARM.zip` :

    // Linux
    os === "linux" && arch === "x64" ?
      `hugo_extended_${version}_Linux-64bit.tar.gz` :
    os === "linux" && arch.endsWith("32") ?
      `hugo_${version}_Linux-32bit.tar.gz` :
    os === "linux" && arch === "arm" ?
      `hugo_${version}_Linux-ARM.tar.gz` :
    os === "linux" && arch === "arm64" ?
      `hugo_${version}_Linux-ARM64.tar.gz` :

    // FreeBSD
    os === "freebsd" && arch === "x64" ?
      `hugo_${version}_FreeBSD-64bit.tar.gz` :
    os === "freebsd" && arch.endsWith("32") ?
      `hugo_${version}_FreeBSD-32bit.tar.gz` :
    os === "freebsd" && arch === "arm" ?
      `hugo_${version}_FreeBSD-ARM.tar.gz` :
    os === "freebsd" && arch === "arm64" ?
      `hugo_${version}_FreeBSD-ARM64.tar.gz` :

    // OpenBSD
    os === "openbsd" && arch === "x64" ?
      `hugo_${version}_OpenBSD-64bit.tar.gz` :
    os === "openbsd" && arch.endsWith("32") ?
      `hugo_${version}_OpenBSD-32bit.tar.gz` :
    os === "openbsd" && arch === "arm" ?
      `hugo_${version}_OpenBSD-ARM.tar.gz` :
    os === "openbsd" && arch === "arm64" ?
      `hugo_${version}_OpenBSD-ARM64.tar.gz` :

    // not gonna work :(
    null;

  return filename;
}

export { installHugo };
