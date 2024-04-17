import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { debuglog } from 'node:util';
import BinWrapper from '@xhmikosr/bin-wrapper';
import { packageConfig } from 'package-config';

const debug = debuglog('hugo-bin');
const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

const destDir = path.join(fileURLToPath(new URL('../vendor/', import.meta.url)));
const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';

debug('[global] HUGO_VERSION:', HUGO_VERSION);
debug('[global] destDir:', destDir);
debug('[global] binName:', binName);

/**
 * @param {string} baseUrl
 * @param {string} hugoVersion
 */
function extendedBin(baseUrl, hugoVersion) {
  debug('[extendedBin] baseUrl:', baseUrl);
  debug('[extendedBin] hugoVersion:', hugoVersion);

  const baseName = `hugo_${hugoVersion}`;
  const baseNameExtended = `hugo_extended_${hugoVersion}`;

  return new BinWrapper()
    .src(new URL(`${baseNameExtended}_darwin-universal.tar.gz`, baseUrl).href, 'darwin', 'arm64')
    .src(new URL(`${baseNameExtended}_darwin-universal.tar.gz`, baseUrl).href, 'darwin', 'x64')
    .src(new URL(`${baseNameExtended}_linux-amd64.tar.gz`, baseUrl).href, 'linux', 'x64')
    .src(new URL(`${baseNameExtended}_linux-arm64.tar.gz`, baseUrl).href, 'linux', 'arm64')
    .src(new URL(`${baseNameExtended}_windows-amd64.zip`, baseUrl).href, 'win32', 'x64')
    // Fall back to the normal version on unsupported platforms
    .src(new URL(`${baseName}_dragonfly-amd64.tar.gz`, baseUrl).href, 'dragonflybsd', 'x64')
    .src(new URL(`${baseName}_freebsd-amd64.tar.gz`, baseUrl).href, 'freebsd', 'x64')
    .src(new URL(`${baseName}_linux-arm.tar.gz`, baseUrl).href, 'linux', 'arm')
    .src(new URL(`${baseName}_netbsd-amd64.tar.gz`, baseUrl).href, 'netbsd', 'x64')
    .src(new URL(`${baseName}_openbsd-amd64.tar.gz`, baseUrl).href, 'openbsd', 'x64')
    .src(new URL(`${baseName}_solaris-amd64.tar.gz`, baseUrl).href, 'openbsd', 'x64')
    .src(new URL(`${baseName}_windows-arm64.zip`, baseUrl).href, 'win32', 'arm64')
    .dest(destDir)
    .use(binName);
}

/**
 * @param {string} baseUrl
 * @param {string} hugoVersion
 */
function normalBin(baseUrl, hugoVersion) {
  debug('[normalBin] baseUrl:', baseUrl);
  debug('[normalBin] hugoVersion:', hugoVersion);

  const baseName = `hugo_${hugoVersion}`;

  return new BinWrapper()
    .src(new URL(`${baseName}_darwin-universal.tar.gz`, baseUrl).href, 'darwin', 'arm64')
    .src(new URL(`${baseName}_darwin-universal.tar.gz`, baseUrl).href, 'darwin', 'x64')
    .src(new URL(`${baseName}_dragonfly-amd64.tar.gz`, baseUrl).href, 'dragonflybsd', 'x64')
    .src(new URL(`${baseName}_freebsd-amd64.tar.gz`, baseUrl).href, 'freebsd', 'x64')
    .src(new URL(`${baseName}_linux-amd64.tar.gz`, baseUrl).href, 'linux', 'x64')
    .src(new URL(`${baseName}_linux-arm.tar.gz`, baseUrl).href, 'linux', 'arm')
    .src(new URL(`${baseName}_linux-arm64.tar.gz`, baseUrl).href, 'linux', 'arm64')
    .src(new URL(`${baseName}_netbsd-amd64.tar.gz`, baseUrl).href, 'netbsd', 'x64')
    .src(new URL(`${baseName}_openbsd-amd64.tar.gz`, baseUrl).href, 'openbsd', 'x64')
    .src(new URL(`${baseName}_solaris-amd64.tar.gz`, baseUrl).href, 'solaris', 'x64')
    .src(new URL(`${baseName}_windows-amd64.zip`, baseUrl).href, 'win32', 'x64')
    .src(new URL(`${baseName}_windows-arm64.zip`, baseUrl).href, 'win32', 'arm64')
    .dest(destDir)
    .use(binName);
}

/**
 * @param {import('pkg-conf').Config} config
 */
function getOptions(config) {
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

  debug('[getOptions] hugoVersion:', version);
  debug('[getOptions] downloadRepo:', downloadRepo);
  debug('[getOptions] isExtended:', isExtended);

  return {
    hugoVersion: version,
    downloadRepo,
    isExtended
  };
}

/**
 * @param {string} cwd
 */
async function main(cwd) {
  const config = await packageConfig('hugo-bin', { cwd });
  const { hugoVersion, downloadRepo, isExtended } = getOptions(config);
  const baseUrl = new URL(`gohugoio/hugo/releases/download/v${hugoVersion}/`, downloadRepo).href;

  debug('[main] baseUrl:', baseUrl);

  return isExtended ? extendedBin(baseUrl, hugoVersion) : normalBin(baseUrl, hugoVersion);
}

export default main;
