'use strict';

const fs = require('fs');
const path = require('path');
const { https } = require('follow-redirects'); // Node's https module doesn't follow redirects, needed for GitHub releases
const decompress = require('decompress');
const sumchecker = require('sumchecker');

installHugo()
  .then(() => {
    console.log('✔ Hugo installed successfully!');
  })
  .catch((error) => {
    console.error('✖ ERROR: Hugo installation failed. :(\n', error);
  });

async function installHugo() {
  // this package's version number (should) always match the Hugo release we want
  const { version } = require('./package.json');
  const downloadBaseUrl = `https://github.com/gohugoio/hugo/releases/download/v${version}/`;
  const downloadFile = getArchiveFilename(version, process.platform, process.arch);
  const checksumFile = `hugo_${version}_checksums.txt`;

  // stop here if there's nothing we can download
  if (!downloadFile) throw 'Are you sure this platform is supported?';

  const downloadUrl = downloadBaseUrl + downloadFile;
  const checksumUrl = downloadBaseUrl + checksumFile;
  const vendorDir = path.join(__dirname, 'vendor');
  const archivePath = path.join(vendorDir, downloadFile);
  const checksumPath = path.join(vendorDir, checksumFile);
  const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';
  const binPath = path.join(vendorDir, binName);

  try {
    // ensure the target directory exists
    await fs.promises.mkdir(vendorDir, { recursive: true });

    await Promise.all([
      // fetch the archive file from GitHub
      downloadToFile(downloadUrl, archivePath),
      // fetch the checksum file from GitHub
      downloadToFile(checksumUrl, checksumPath),
    ]);

    // validate the checksum of the download
    await checkChecksum(vendorDir, checksumPath, downloadFile);

    // extract the downloaded file
    await decompress(archivePath, vendorDir);
  } finally {
    await Promise.all([
      // delete the downloaded archive when finished
      deleteFile(archivePath),
      // ...and the checksum file
      deleteFile(checksumPath),
    ]);
  }

  // return the full path to our Hugo binary
  return binPath;
}

async function downloadToFile(url, dest) {
  return new Promise((resolve, reject) => https.get(url, response => {
    // throw an error immediately if the download failed
    if (response.statusCode !== 200) {
      response.resume();
      reject(new Error(`Download failed: status code ${response.statusCode} from ${url}`));
      return;
    }

    // pipe the response directly to a file
    response.pipe(
      fs.createWriteStream(dest)
        .on('finish', resolve)
        .on('error', reject)
    );
  }).on('error', reject));
}

async function deleteFile(path) {
  if (fs.existsSync(path)) {
    return await fs.promises.unlink(path);
  } else {
    return;
  }
}

async function checkChecksum(baseDir, checksumFile, binFile) {
  const checker = new sumchecker.ChecksumValidator('sha256', checksumFile, {
    // returns a completely different hash without this for some reason
    defaultTextEncoding: 'binary'
  });

  return await checker.validate(baseDir, binFile);
}

// Hugo Extended supports: macOS x64, macOS ARM64, Linux x64, Windows x64.
// all other combos fall back to vanilla Hugo. there are surely much better ways
// to do this but this is easy to read/update. :)
function getArchiveFilename(version, os, arch) {
  const filename =
    // macOS
    os === 'darwin' && arch === 'x64'
      ? `hugo_extended_${version}_macOS-64bit.tar.gz` :
    os === 'darwin' && arch === 'arm64'
      ? `hugo_extended_${version}_macOS-ARM64.tar.gz` :

    // Windows
    os === 'win32' && arch === 'x64'
      ? `hugo_extended_${version}_Windows-64bit.zip` :
    os === 'win32' && arch.endsWith('32')
      ? `hugo_${version}_Windows-32bit.zip` :

    // Linux
    os === 'linux' && arch === 'x64'
      ? `hugo_extended_${version}_Linux-64bit.tar.gz` :
    os === 'linux' && arch.endsWith('32')
      ? `hugo_${version}_Linux-32bit.tar.gz` :
    os === 'linux' && arch === 'arm'
      ? `hugo_${version}_Linux-ARM.tar.gz` :
    os === 'linux' && arch === 'arm64'
      ? `hugo_${version}_Linux-ARM64.tar.gz` :

    // FreeBSD
    os === 'freebsd' && arch === 'x64'
      ? `hugo_${version}_FreeBSD-64bit.tar.gz` :
    os === 'freebsd' && arch.endsWith('32')
      ? `hugo_${version}_FreeBSD-32bit.tar.gz` :
    os === 'freebsd' && arch === 'arm'
      ? `hugo_${version}_FreeBSD-ARM.tar.gz` :
    os === 'freebsd' && arch === 'arm64'
      ? `hugo_${version}_FreeBSD-ARM64.tar.gz` :

    // OpenBSD
    os === 'openbsd' && arch === 'x64'
      ? `hugo_${version}_OpenBSD-64bit.tar.gz` :
    os === 'openbsd' && arch.endsWith('32')
      ? `hugo_${version}_OpenBSD-32bit.tar.gz` :
    os === 'openbsd' && arch === 'arm'
      ? `hugo_${version}_OpenBSD-ARM.tar.gz` :
    os === 'openbsd' && arch === 'arm64'
      ? `hugo_${version}_OpenBSD-ARM64.tar.gz` :

    // not gonna work :(
    null;

  return filename;
}

module.exports.installHugo = installHugo;
