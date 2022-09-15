import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import BinWrapper from 'bin-wrapper';
import { packageConfigSync } from 'pkg-conf';

const { hugoVersion } = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));

const destDir = path.join(fileURLToPath(new URL('../vendor', import.meta.url)));
const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';

const extendedBin = (baseDownloadUrl) => new BinWrapper()
  .src(`${baseDownloadUrl}hugo_extended_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'arm64')
  .src(`${baseDownloadUrl}hugo_extended_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'x64')
  .src(`${baseDownloadUrl}hugo_extended_${hugoVersion}_linux-amd64.tar.gz`, 'linux', 'x64')
  .src(`${baseDownloadUrl}hugo_extended_${hugoVersion}_linux-arm64.tar.gz`, 'linux', 'arm64')
  .src(`${baseDownloadUrl}hugo_extended_${hugoVersion}_windows-amd64.zip`, 'win32', 'x64')
  // Fall back to the normal version on unsupported platforms
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_linux-arm.tar.gz`, 'linux', 'arm')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_windows-arm64.zip`, 'win32', 'arm64')
  .dest(destDir)
  .use(binName);

const normalBin = (baseDownloadUrl) => new BinWrapper()
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'arm64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_linux-amd64.tar.gz`, 'linux', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_linux-arm.tar.gz`, 'linux', 'arm')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_linux-arm64.tar.gz`, 'linux', 'arm64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_windows-amd64.zip`, 'win32', 'x64')
  .src(`${baseDownloadUrl}hugo_${hugoVersion}_windows-arm64.zip`, 'win32', 'arm64')
  .dest(destDir)
  .use(binName);

function main(projectRoot) {
  const config = packageConfigSync('hugo-bin', { cwd: projectRoot });
  const extended = (process.env.HUGO_BIN_BUILD_TAGS || process.env.npm_config_hugo_bin_build_tags || config.buildTags) === 'extended';
  const downloadRepo = (process.env.HUGO_BIN_DOWNLOAD_REPO || process.env.npm_config_hugo_bin_download_repo || config.downloadRepo || 'https://github.com');

  const baseDownloadUrl = `${downloadRepo}/gohugoio/hugo/releases/download/v${hugoVersion}/`;

  return extended ? extendedBin(baseDownloadUrl) : normalBin(baseDownloadUrl);
}

export default main;
