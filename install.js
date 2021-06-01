'use strict';

const fs = require("fs");
const path = require("path");
const { https } = require("follow-redirects");
const decompress = require('decompress');

(async () => {
  install()
    .then(() => {
      console.log('✔ Hugo installed successfully!');
    })
    .catch((error) => {
      console.error('✖ ERROR: Hugo installation failed. :(\n', error);
    });
})();

async function install() {
  // this package's version number (should) always matches the Hugo version we want
  const { version } = require('./package.json');
  const downloadBaseUrl = `https://github.com/gohugoio/hugo/releases/download/v${version}/`;

  // Hugo Extended supports: macOS x64, macOS ARM64, Linux x64, Windows x64.
  // all other combos fall back to vanilla Hugo.
  const downloadFile =
    process.platform === 'darwin' && process.arch === 'x64'
      ? `hugo_extended_${version}_macOS-64bit.tar.gz` :
    process.platform === 'darwin' && process.arch === 'arm64'
      ? `hugo_extended_${version}_macOS-ARM64.tar.gz` :
    process.platform === 'win32' && process.arch === 'x64'
      ? `hugo_extended_${version}_Windows-64bit.zip` :
    process.platform === 'win32' && process.arch.endsWith('32')
      ? `hugo_${version}_Windows-32bit.zip` :
    process.platform === 'linux' && process.arch === 'x64'
      ? `hugo_extended_${version}_Linux-64bit.tar.gz` :
    process.platform === 'linux' && process.arch.endsWith('32')
      ? `hugo_${version}_Linux-32bit.tar.gz` :
    process.platform === 'linux' && process.arch === 'arm'
      ? `hugo_${version}_Linux-ARM.tar.gz` :
    process.platform === 'linux' && process.arch === 'arm64'
      ? `hugo_${version}_Linux-ARM64.tar.gz` :
    process.platform === 'freebsd' && process.arch === 'x64'
      ? `hugo_${version}_FreeBSD-64bit.tar.gz` :
    process.platform === 'freebsd' && process.arch.endsWith('32')
      ? `hugo_${version}_FreeBSD-32bit.tar.gz` :
    process.platform === 'freebsd' && process.arch === 'arm'
      ? `hugo_${version}_FreeBSD-ARM.tar.gz` :
    process.platform === 'freebsd' && process.arch === 'arm64'
      ? `hugo_${version}_FreeBSD-ARM64.tar.gz` :
    process.platform === 'openbsd' && process.arch === 'x64'
      ? `hugo_${version}_OpenBSD-64bit.tar.gz` :
    process.platform === 'openbsd' && process.arch.endsWith('32')
      ? `hugo_${version}_OpenBSD-32bit.tar.gz` :
    process.platform === 'openbsd' && process.arch === 'arm'
      ? `hugo_${version}_OpenBSD-ARM.tar.gz` :
    process.platform === 'openbsd' && process.arch === 'arm64'
      ? `hugo_${version}_OpenBSD-ARM64.tar.gz` :
    null;

  // stop here if there's nothing we can download
  if (!downloadFile) throw "Are you sure this platform is supported?";

  let downloadUrl = downloadBaseUrl + downloadFile;
  let vendorDir = path.join(__dirname, 'vendor');
  let archivePath = path.join(vendorDir, downloadFile);
  let binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';
  let binPath = path.join(vendorDir, binName);

  try {
    // ensure the target directory exists
    await fs.promises.mkdir(vendorDir, { recursive: true });

    // fetch the archive file from GitHub
    await new Promise((resolve, reject) => https.get(downloadUrl, response => {
      // throw an error immediately if the download failed
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Download failed: status code ${response.statusCode} from ${downloadUrl}`));
        return;
      }

      // pipe the response directly to a file
      response.pipe(
        fs.createWriteStream(archivePath)
          .on('finish', resolve)
          .on('error', reject)
      );
    }).on('error', reject));

    // TODO: validate the checksum of the download
    // https://github.com/jakejarvis/hugo-extended/issues/1

    // extract the downloaded file
    await decompress(archivePath, vendorDir);
  } finally {
    // delete the downloaded archive when finished
    if (fs.existsSync(archivePath)) {
      await fs.promises.unlink(archivePath);
    }
  }

  // return the full path to our Hugo binary
  return binPath;
}
