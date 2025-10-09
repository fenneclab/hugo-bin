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
 * @param {boolean} isWithDeploy
 */
function extendedBin(baseUrl, hugoVersion, isWithDeploy) {
  debug('[extendedBin] baseUrl:', baseUrl);
  debug('[extendedBin] hugoVersion:', hugoVersion);
  debug('[extendedBin] isWithDeploy:', isWithDeploy);

  const baseName = `hugo_${hugoVersion}`;
  const baseNameExtended = isWithDeploy ? `hugo_extended_withdeploy_${hugoVersion}` : `hugo_extended_${hugoVersion}`;

  return new BinWrapper()
    .src(`${baseUrl}${baseNameExtended}_darwin-universal.tar.gz`, 'darwin', 'arm64')
    .src(`${baseUrl}${baseNameExtended}_darwin-universal.tar.gz`, 'darwin', 'x64')
    .src(`${baseUrl}${baseNameExtended}_linux-amd64.tar.gz`, 'linux', 'x64')
    .src(`${baseUrl}${baseNameExtended}_linux-arm64.tar.gz`, 'linux', 'arm64')
    .src(`${baseUrl}${baseNameExtended}_windows-amd64.zip`, 'win32', 'x64')
    // Fall back to the normal version on unsupported platforms
    .src(`${baseUrl}${baseName}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
    .src(`${baseUrl}${baseName}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
    .src(`${baseUrl}${baseName}_linux-arm.tar.gz`, 'linux', 'arm')
    .src(`${baseUrl}${baseName}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
    .src(`${baseUrl}${baseName}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}${baseName}_solaris-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}${baseName}_windows-arm64.zip`, 'win32', 'arm64')
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
    .src(`${baseUrl}${baseName}_darwin-universal.tar.gz`, 'darwin', 'arm64')
    .src(`${baseUrl}${baseName}_darwin-universal.tar.gz`, 'darwin', 'x64')
    .src(`${baseUrl}${baseName}_dragonfly-amd64.tar.gz`, 'dragonflybsd', 'x64')
    .src(`${baseUrl}${baseName}_freebsd-amd64.tar.gz`, 'freebsd', 'x64')
    .src(`${baseUrl}${baseName}_linux-amd64.tar.gz`, 'linux', 'x64')
    .src(`${baseUrl}${baseName}_linux-arm.tar.gz`, 'linux', 'arm')
    .src(`${baseUrl}${baseName}_linux-arm64.tar.gz`, 'linux', 'arm64')
    .src(`${baseUrl}${baseName}_netbsd-amd64.tar.gz`, 'netbsd', 'x64')
    .src(`${baseUrl}${baseName}_openbsd-amd64.tar.gz`, 'openbsd', 'x64')
    .src(`${baseUrl}${baseName}_solaris-amd64.tar.gz`, 'solaris', 'x64')
    .src(`${baseUrl}${baseName}_windows-amd64.zip`, 'win32', 'x64')
    .src(`${baseUrl}${baseName}_windows-arm64.zip`, 'win32', 'arm64')
    .dest(destDir)
    .use(binName);
}

/**
 * @param {import('package-config').Config} config
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
  const rawBuildTags = [
    process.env.HUGO_BIN_BUILD_TAGS,
    process.env.npm_config_hugo_bin_build_tags,
    config.buildTags
  ].filter(Boolean);
  const buildTags = new Set(String(rawBuildTags)
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean));
  const isExtended = buildTags.has('extended');
  const isWithDeploy = buildTags.has('withdeploy');

  // Strip any leading `v` from hugoVersion because otherwise we'll end up with duplicate `v`s
  const version = hugoVersion[0] === 'v' ? hugoVersion.slice(1) : hugoVersion;

  debug('[getOptions] hugoVersion:', version);
  debug('[getOptions] downloadRepo:', downloadRepo);
  debug('[getOptions] isExtended:', isExtended);
  debug('[getOptions] isWithDeploy:', isWithDeploy);

  return {
    hugoVersion: version,
    downloadRepo,
    isExtended,
    isWithDeploy
  };
}

/**
 * @param {string} cwd
 */
async function main(cwd) {
  const config = await packageConfig('hugo-bin', { cwd });
  const { hugoVersion, downloadRepo, isExtended, isWithDeploy } = getOptions(config);
  const baseUrl = `${downloadRepo}/gohugoio/hugo/releases/download/v${hugoVersion}/`;

  debug('[main] baseUrl:', baseUrl);

  return isExtended ? extendedBin(baseUrl, hugoVersion, isWithDeploy) : normalBin(baseUrl, hugoVersion);
}

export default main;
