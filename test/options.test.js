import fs from 'node:fs/promises';
import process from 'node:process';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import hugoBin from '../lib/index.js';

const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

const environmentVariables = [
  'HUGO_BIN_BUILD_TAGS',
  'npm_config_hugo_bin_build_tags',
  'HUGO_BIN_DOWNLOAD_REPO',
  'npm_config_hugo_bin_download_repo',
  'HUGO_BIN_HUGO_VERSION',
  'npm_config_hugo_bin_hugo_version'
];

// these always use the normal artifact, never extended/withdeploy
const FALLBACK_OS = new Set([
  'dragonflybsd',
  'freebsd',
  'netbsd',
  'openbsd',
  'solaris'
]);

// mirrors the target list in lib/index.js
const TARGETS = [
  { os: 'darwin', arch: 'arm64', suffix: '_darwin-universal.pkg' },
  { os: 'darwin', arch: 'x64', suffix: '_darwin-universal.pkg' },
  { os: 'linux', arch: 'x64', suffix: '_linux-amd64.tar.gz' },
  { os: 'linux', arch: 'arm64', suffix: '_linux-arm64.tar.gz' },
  { os: 'linux', arch: 'arm', suffix: '_linux-arm.tar.gz' },
  { os: 'win32', arch: 'x64', suffix: '_windows-amd64.zip' },
  { os: 'win32', arch: 'arm64', suffix: '_windows-arm64.zip' },
  { os: 'dragonflybsd', arch: 'x64', suffix: '_dragonfly-amd64.tar.gz' },
  { os: 'freebsd', arch: 'x64', suffix: '_freebsd-amd64.tar.gz' },
  { os: 'netbsd', arch: 'x64', suffix: '_netbsd-amd64.tar.gz' },
  { os: 'openbsd', arch: 'x64', suffix: '_openbsd-amd64.tar.gz' },
  { os: 'solaris', arch: 'x64', suffix: '_solaris-amd64.tar.gz' }
];

async function getSources() {
  const lib = await hugoBin(process.cwd());
  return lib.src();
}

const testSuite = suite('options');

testSuite.before.each(() => {
  for (const variable of environmentVariables) {
    // Ensure that the environment is cleaned before next test run
    delete process.env[variable];
  }
});

testSuite('environment is clean before each test', () => {
  for (const variable of environmentVariables) {
    assert.is(process.env[variable], undefined);
  }
});

testSuite('builds the expected URL for every target', async() => {
  const sources = await getSources();

  assert.is(sources.length, TARGETS.length);

  for (const { os, arch, suffix } of TARGETS) {
    const source = sources.find(s => s.os === os && s.arch === arch);
    assert.ok(source, `missing source for ${os}/${arch}`);
    assert.is(
      source.url,
      `https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}${suffix}`
    );
  }
});

testSuite('uses a custom download repo', async() => {
  process.env.npm_config_hugo_bin_download_repo = 'https://example.com';
  const sources = await getSources();

  assert.ok(sources.every(s => s.url.startsWith('https://example.com/gohugoio/hugo/releases/download/')));
});

testSuite('uses a custom version', async() => {
  process.env.npm_config_hugo_bin_hugo_version = '122.0';
  const sources = await getSources();

  assert.ok(sources.every(s => s.url.includes('/v122.0/hugo_122.0')));
});

testSuite('strips a leading `v` from the version', async() => {
  process.env.npm_config_hugo_bin_hugo_version = 'v122.0';
  const sources = await getSources();

  assert.ok(sources.every(s => s.url.includes('/v122.0/')));
  assert.ok(sources.every(s => !s.url.includes('vv122.0')));
});

testSuite('extended tag picks the extended artifact', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended';
  const sources = await getSources();

  for (const { os, url } of sources) {
    const expected = FALLBACK_OS.has(os) ? `hugo_${HUGO_VERSION}_` : `hugo_extended_${HUGO_VERSION}_`;
    assert.ok(url.includes(expected), url);
  }
});

testSuite('extended + withdeploy tags pick the withdeploy artifact', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended,withdeploy';
  const sources = await getSources();

  for (const { os, url } of sources) {
    const expected = FALLBACK_OS.has(os) ? `hugo_${HUGO_VERSION}_` : `hugo_extended_withdeploy_${HUGO_VERSION}_`;
    assert.ok(url.includes(expected), url);
  }
});

testSuite('withdeploy without extended is ignored', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'withdeploy';
  const sources = await getSources();

  assert.ok(sources.every(s => s.url.includes(`hugo_${HUGO_VERSION}_`)));
  assert.ok(sources.every(s => !s.url.includes('extended')));
  assert.ok(sources.every(s => !s.url.includes('withdeploy')));
});

testSuite('build tags are trimmed, lowercased and unknown ones dropped', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = '  Extended , WithDeploy , Other ';
  const sources = await getSources();

  assert.ok(sources.every(s => FALLBACK_OS.has(s.os) || s.url.includes(`hugo_extended_withdeploy_${HUGO_VERSION}_`)));
  assert.ok(sources.every(s => !s.url.includes('other')));
});

testSuite('build tags from the env var and npm config are merged', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended';
  process.env.npm_config_hugo_bin_build_tags = 'withdeploy';
  const sources = await getSources();

  assert.ok(sources.every(s => FALLBACK_OS.has(s.os) || s.url.includes(`hugo_extended_withdeploy_${HUGO_VERSION}_`)));
});

testSuite('env vars take precedence over npm config', async() => {
  process.env.HUGO_BIN_HUGO_VERSION = '0.110.0';
  process.env.npm_config_hugo_bin_hugo_version = '0.120.0';
  process.env.HUGO_BIN_DOWNLOAD_REPO = 'https://env.example.com';
  process.env.npm_config_hugo_bin_download_repo = 'https://npm.example.com';
  const sources = await getSources();

  assert.ok(sources.every(s => s.url.startsWith('https://env.example.com/')));
  assert.ok(sources.every(s => s.url.includes('/v0.110.0/')));
  assert.ok(sources.every(s => !s.url.includes('0.120.0')));
  assert.ok(sources.every(s => !s.url.includes('npm.example.com')));
});

testSuite('empty config values fall back to defaults', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  process.env.npm_config_hugo_bin_download_repo = '';
  process.env.npm_config_hugo_bin_hugo_version = '';
  const sources = await getSources();

  assert.ok(sources.every(s =>
    s.url.startsWith(`https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/`)));
});

testSuite('uses the platform-specific binary name', async() => {
  const lib = await hugoBin(process.cwd());

  assert.is(lib.use(), process.platform === 'win32' ? 'hugo.exe' : 'hugo');
});

testSuite('installs into the vendor directory', async() => {
  const lib = await hugoBin(process.cwd());

  assert.ok(lib.dest().includes('vendor'));
});

testSuite.run();
