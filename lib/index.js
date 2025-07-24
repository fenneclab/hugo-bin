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
 * @typedef {Object} BinOptions
 * @property {boolean} [extended]
 * @property {boolean} [withDeploy]
 */

/**
 * @param {string} baseUrl
 * @param {string} hugoVersion
 * @param {BinOptions} options
 * @returns {BinWrapper}
 */
function createBin(baseUrl, hugoVersion, { extended = false, withDeploy = false } = {}) {
  debug('[createBin] baseUrl:', baseUrl);
  debug('[createBin] hugoVersion:', hugoVersion);
  debug('[createBin] extended:', extended);
  debug('[createBin] withDeploy:', withDeploy);

  const baseName = `hugo_${hugoVersion}`;
  const baseNameExtended = withDeploy ?
    `hugo_extended_withdeploy_${hugoVersion}` :
    `hugo_extended_${hugoVersion}`;
  const chosenBase = extended ? baseNameExtended : baseName;

  const targets = [
    // macOS
    { os: 'darwin', arch: 'arm64', suffix: '_darwin-universal.tar.gz' },
    { os: 'darwin', arch: 'x64', suffix: '_darwin-universal.tar.gz' },

    // Linux
    { os: 'linux', arch: 'x64', suffix: '_linux-amd64.tar.gz' },
    { os: 'linux', arch: 'arm64', suffix: '_linux-arm64.tar.gz' },
    { os: 'linux', arch: 'arm', suffix: '_linux-arm.tar.gz' },

    // Windows
    { os: 'win32', arch: 'x64', suffix: '_windows-amd64.zip' },
    { os: 'win32', arch: 'arm64', suffix: '_windows-arm64.zip' },

    /* eslint-disable @stylistic/object-curly-newline */
    // Fall back to the normal version on unsupported platforms
    { os: 'dragonflybsd', arch: 'x64', suffix: '_dragonfly-amd64.tar.gz', fallback: true },
    { os: 'freebsd', arch: 'x64', suffix: '_freebsd-amd64.tar.gz', fallback: true },
    { os: 'netbsd', arch: 'x64', suffix: '_netbsd-amd64.tar.gz', fallback: true },
    { os: 'openbsd', arch: 'x64', suffix: '_openbsd-amd64.tar.gz', fallback: true },
    { os: 'solaris', arch: 'x64', suffix: '_solaris-amd64.tar.gz', fallback: true }
    /* eslint-enable @stylistic/object-curly-newline */
  ];

  let bin = new BinWrapper();

  for (const { os, arch, suffix, fallback } of targets) {
    const name = fallback ? baseName : chosenBase;
    bin = bin.src(`${baseUrl}${name}${suffix}`, os, arch);
  }

  return bin.dest(destDir).version(hugoVersion).use(binName);
}

/**
 * @param {import('package-config').Config} config
 * @returns {{hugoVersion: string, downloadRepo: string, extended: boolean, withDeploy: boolean}}
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
  const extended = buildTags.has('extended');
  const withDeploy = buildTags.has('withdeploy');

  // Strip any leading `v` from hugoVersion because otherwise we'll end up with duplicate `v`s
  const version = hugoVersion[0] === 'v' ? hugoVersion.slice(1) : hugoVersion;

  debug('[getOptions] hugoVersion:', version);
  debug('[getOptions] downloadRepo:', downloadRepo);
  debug('[getOptions] extended:', extended);
  debug('[getOptions] withDeploy:', withDeploy);

  return {
    hugoVersion: version,
    downloadRepo,
    extended,
    withDeploy
  };
}

/**
 * @param {string} cwd
 * @returns {Promise<BinWrapper>}
 */
async function main(cwd) {
  const config = await packageConfig('hugo-bin', { cwd });
  const { hugoVersion, downloadRepo, extended, withDeploy } = getOptions(config);
  const baseUrl = `${downloadRepo}/gohugoio/hugo/releases/download/v${hugoVersion}/`;

  debug('[main] baseUrl:', baseUrl);

  return createBin(baseUrl, hugoVersion, { extended, withDeploy });
}

export default main;
