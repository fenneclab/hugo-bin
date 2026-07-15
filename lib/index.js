import fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { debuglog } from 'node:util';
import BinWrapper from '@xhmikosr/bin-wrapper';
import decompressPkg from '@xhmikosr/decompress-pkg';
import decompressTargz from '@xhmikosr/decompress-targz';
import decompressUnzip from '@xhmikosr/decompress-unzip';
import { packageConfig } from 'package-config';

const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

const debug = debuglog('hugo-bin');

const destDir = fileURLToPath(new URL('../vendor', import.meta.url));
const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';

const targets = [
  // macOS
  { os: 'darwin', arch: 'arm64', suffix: '_darwin-universal.pkg' },
  { os: 'darwin', arch: 'x64', suffix: '_darwin-universal.pkg' },

  // Linux
  { os: 'linux', arch: 'x64', suffix: '_linux-amd64.tar.gz' },
  { os: 'linux', arch: 'arm64', suffix: '_linux-arm64.tar.gz' },
  { os: 'linux', arch: 'arm', suffix: '_linux-arm.tar.gz' },

  // Windows
  { os: 'win32', arch: 'x64', suffix: '_windows-amd64.zip' },
  { os: 'win32', arch: 'arm64', suffix: '_windows-arm64.zip' },

  /* eslint-disable @stylistic/object-curly-newline -- keep each fallback target on a single line */
  // Fallbacks
  { os: 'dragonflybsd', arch: 'x64', suffix: '_dragonfly-amd64.tar.gz', fallback: true },
  { os: 'freebsd', arch: 'x64', suffix: '_freebsd-amd64.tar.gz', fallback: true },
  { os: 'netbsd', arch: 'x64', suffix: '_netbsd-amd64.tar.gz', fallback: true },
  { os: 'openbsd', arch: 'x64', suffix: '_openbsd-amd64.tar.gz', fallback: true },
  { os: 'solaris', arch: 'x64', suffix: '_solaris-amd64.tar.gz', fallback: true }
  /* eslint-enable @stylistic/object-curly-newline */
];

/* eslint-disable unicorn/no-top-level-side-effects -- log resolved globals once at module load */
debug('[global] HUGO_VERSION: %s', HUGO_VERSION);
debug('[global] destDir: %s', destDir);
debug('[global] binName: %s', binName);
/* eslint-enable unicorn/no-top-level-side-effects */

/**
 @typedef {object} BinOptions
 @property {boolean} [extended] Download the extended Hugo build.
 @property {boolean} [withDeploy] Download the extended build with deploy support.
 */

/**
 Build a configured BinWrapper for the requested Hugo release.

 @param {string} baseUrl Base URL the release archives are downloaded from.
 @param {string} hugoVersion Hugo version to download, without a leading `v`.
 @param {BinOptions} options Variant options controlling the extended/deploy build.
 @returns {BinWrapper} Wrapper pointing at the platform-specific Hugo binary.
 */
function createBin(baseUrl, hugoVersion, { extended = false, withDeploy = false } = {}) {
  const baseName = `hugo_${hugoVersion}`;
  const baseNameExtended = withDeploy ?
    `hugo_extended_withdeploy_${hugoVersion}` :
    `hugo_extended_${hugoVersion}`;
  const chosenBase = extended ? baseNameExtended : baseName;

  let bin = new BinWrapper({
    decompress: {
      plugins: [
        decompressPkg(),
        decompressTargz(),
        decompressUnzip()
      ]
    }
  });

  for (const { os, arch, suffix, fallback } of targets) {
    const name = fallback ? baseName : chosenBase;
    bin = bin.src(`${baseUrl}${name}${suffix}`, os, arch);
  }

  debug('[createBin] resolvedUrls: %o', bin.resolvedUrls());

  return bin.dest(destDir).version(hugoVersion).use(binName);
}

/**
 Resolve Hugo download options from env vars and package config.

 @param {import('package-config').Config} config Resolved `hugo-bin` package config.
 @returns {{hugoVersion: string, downloadRepo: string, extended: boolean, withDeploy: boolean}} Normalized download options.
 */
function getOptions(config) {
  const hugoVersionRaw = [
    process.env.HUGO_BIN_HUGO_VERSION,
    process.env.npm_config_hugo_bin_hugo_version,
    config.version
  ].find(Boolean) ?? HUGO_VERSION;

  const downloadRepo = [
    process.env.HUGO_BIN_DOWNLOAD_REPO,
    process.env.npm_config_hugo_bin_download_repo,
    config.downloadRepo
  ].find(Boolean) ?? 'https://github.com';

  const buildTags = new Set([
    process.env.HUGO_BIN_BUILD_TAGS,
    process.env.npm_config_hugo_bin_build_tags,
    config.buildTags
  ]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean));

  const extended = buildTags.has('extended');
  const withDeploy = buildTags.has('withdeploy');

  // Strip any leading `v` from hugoVersionRaw because otherwise we'll end up with duplicate `v`s
  const hugoVersion = hugoVersionRaw[0] === 'v' ? hugoVersionRaw.slice(1) : hugoVersionRaw;

  debug('[getOptions] %o', {
    hugoVersion,
    downloadRepo,
    extended,
    withDeploy
  });

  return {
    hugoVersion,
    downloadRepo,
    extended,
    withDeploy
  };
}

/**
 Resolve options and build the Hugo BinWrapper for the given working directory.

 @param {string} cwd Directory to read `hugo-bin` config from.
 @returns {Promise<BinWrapper>} Wrapper that downloads and exposes the Hugo binary.
 */
async function main(cwd) {
  const config = await packageConfig('hugo-bin', { cwd });
  const { hugoVersion, downloadRepo, extended, withDeploy } = getOptions(config);
  const baseUrl = `${downloadRepo}/gohugoio/hugo/releases/download/v${hugoVersion}/`;

  debug('[main] baseUrl: %s', baseUrl);

  return createBin(baseUrl, hugoVersion, { extended, withDeploy });
}

export default main;
