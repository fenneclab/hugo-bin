import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import BinWrapper from '@xhmikosr/bin-wrapper';
import { packageConfig } from 'package-config';

const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

const destDir = path.join(fileURLToPath(new URL('../vendor/', import.meta.url)));
const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';

/**
 * @param {string} baseUrl
 * @param {string} hugoVersion
 */
function extendedBin(baseUrl, hugoVersion) {
  return new BinWrapper()
    .src(`${baseUrl}hugo_extended_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'arm64')
    .src(`${baseUrl}hugo_extended_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'x64')
    .src(`${baseUrl}hugo_extended_${hugoVersion}_linux-amd64.tar.gz`, 'linux', 'x64')
    .src(`${baseUrl}hugo_extended_${hugoVersion}_linux-arm64.tar.gz`, 'linux', 'arm64')
    .src(`${baseUrl}hugo_extended_${hugoVersion}_windows-amd64.zip`, 'win32', 'x64')
    // Fall back to the normal version on unsupported platforms
    .src(`${baseUrl}hugo_${hugoVersion}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_linux-arm.tar.gz`, 'linux', 'arm')
    .src(`${baseUrl}hugo_${hugoVersion}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_solaris-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_windows-arm64.zip`, 'win32', 'arm64')
    .dest(destDir)
    .use(binName);
}

/**
 * @param {string} baseUrl
 * @param {string} hugoVersion
 */
function normalBin(baseUrl, hugoVersion) {
  return new BinWrapper()
    .src(`${baseUrl}hugo_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'arm64')
    .src(`${baseUrl}hugo_${hugoVersion}_darwin-universal.tar.gz`, 'darwin', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_linux-amd64.tar.gz`, 'linux', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_linux-arm.tar.gz`, 'linux', 'arm')
    .src(`${baseUrl}hugo_${hugoVersion}_linux-arm64.tar.gz`, 'linux', 'arm64')
    .src(`${baseUrl}hugo_${hugoVersion}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_solaris-amd64.tar.gz`, 'solaris', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_windows-amd64.zip`, 'win32', 'x64')
    .src(`${baseUrl}hugo_${hugoVersion}_windows-arm64.zip`, 'win32', 'arm64')
    .dest(destDir)
    .use(binName);
}

/**
 * @param {string} cwd
 */
async function main(cwd) {
  const config = await packageConfig('hugo-bin', { cwd });
  const hugoVersion = [
    process.env.HUGO_BIN_HUGO_VERSION,
    process.env.npm_config_hugo_bin_hugo_version,
    config.version
  ].find(Boolean) ?? HUGO_VERSION;
  const downloadRepo = [
    process.env.HUGO_BIN_DOWNLOAD_REPO,
    process.env.npm_config_hugo_bin_download_repo,
    config.downloadRepo
  ].find(Boolean) ?? 'https://github.com';
  const isExtended = [
    process.env.HUGO_BIN_BUILD_TAGS,
    process.env.npm_config_hugo_bin_build_tags,
    config.buildTags
  ].includes('extended');

  // Strip any leading `v` from hugoVersion because otherwise we'll end up with duplicate `v`s
  const version = hugoVersion[0] === 'v' ? hugoVersion.slice(1) : hugoVersion;
  const baseUrl = `${downloadRepo}/gohugoio/hugo/releases/download/v${version}/`;

  return isExtended ? extendedBin(baseUrl, version) : normalBin(baseUrl, version);
}

export default main;
