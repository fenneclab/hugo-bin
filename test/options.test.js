import process from 'node:process';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import hugoBin from '../lib/index.js';
import pkg from '../package.json' with { type: 'json' };

const { hugoVersion: HUGO_VERSION } = pkg;

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

async function getSources(options) {
  const lib = await hugoBin(process.cwd(), options);
  return lib.src();
}

// splits the sources for the current process into the one(s) actually
// downloaded on this OS/arch vs every other platform's entries
async function splitByCurrentPlatform() {
  const lib = await hugoBin(process.cwd());
  const resolvedUrls = new Set(lib.resolvedUrls());
  const fileName = url => new URL(url).pathname.split('/').pop();

  return {
    current: lib.src().filter(s => resolvedUrls.has(s.url)).map(s => fileName(s.url)),
    other: lib.src().filter(s => !resolvedUrls.has(s.url)).map(s => fileName(s.url))
  };
}

function stubChecksums(fileNames) {
  const text = fileNames.map(name => `${'a'.repeat(64)}  ${name}`).join('\n');
  vi.stubGlobal('fetch', vi.fn(async() => ({ ok: true, status: 200, text: async() => text })));
}

describe('options', () => {
  beforeEach(() => {
    for (const variable of environmentVariables) {
      // Ensure that the environment is cleaned before next test run
      delete process.env[variable];
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('environment is clean before each test', () => {
    for (const variable of environmentVariables) {
      expect(process.env[variable]).toBeUndefined();
    }
  });

  it('builds the expected URL for every target', async() => {
    const sources = await getSources();

    expect(sources.length).toBe(TARGETS.length);

    for (const { os, arch, suffix } of TARGETS) {
      const source = sources.find(s => s.os === os && s.arch === arch);
      expect(source, `missing source for ${os}/${arch}`).toBeTruthy();
      expect(source.url).toBe(`https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}${suffix}`);
    }
  });

  it('uses a custom download repo', async() => {
    process.env.npm_config_hugo_bin_download_repo = 'https://example.com';
    const sources = await getSources();

    expect(sources.every(s => s.url.startsWith('https://example.com/gohugoio/hugo/releases/download/'))).toBe(true);
  });

  it('uses a custom version', async() => {
    process.env.npm_config_hugo_bin_hugo_version = '122.0';
    const sources = await getSources();

    expect(sources.every(s => s.url.includes('/v122.0/hugo_122.0'))).toBe(true);
  });

  it('strips a leading `v` from the version', async() => {
    process.env.npm_config_hugo_bin_hugo_version = 'v122.0';
    const sources = await getSources();

    expect(sources.every(s => s.url.includes('/v122.0/'))).toBe(true);
    expect(sources.every(s => !s.url.includes('vv122.0'))).toBe(true);
  });

  it('extended tag picks the extended artifact', async() => {
    process.env.HUGO_BIN_BUILD_TAGS = 'extended';
    const sources = await getSources();

    for (const { os, url } of sources) {
      const expected = FALLBACK_OS.has(os) ? `hugo_${HUGO_VERSION}_` : `hugo_extended_${HUGO_VERSION}_`;
      expect(url).toContain(expected);
    }
  });

  it('extended + withdeploy tags pick the withdeploy artifact', async() => {
    process.env.HUGO_BIN_BUILD_TAGS = 'extended,withdeploy';
    const sources = await getSources();

    for (const { os, url } of sources) {
      const expected = FALLBACK_OS.has(os) ? `hugo_${HUGO_VERSION}_` : `hugo_extended_withdeploy_${HUGO_VERSION}_`;
      expect(url).toContain(expected);
    }
  });

  it('withdeploy without extended is ignored', async() => {
    process.env.HUGO_BIN_BUILD_TAGS = 'withdeploy';
    const sources = await getSources();

    expect(sources.every(s => s.url.includes(`hugo_${HUGO_VERSION}_`))).toBe(true);
    expect(sources.every(s => !s.url.includes('extended'))).toBe(true);
    expect(sources.every(s => !s.url.includes('withdeploy'))).toBe(true);
  });

  it('build tags are trimmed, lowercased and unknown ones dropped', async() => {
    process.env.HUGO_BIN_BUILD_TAGS = '  Extended , WithDeploy , Other ';
    const sources = await getSources();

    expect(sources.every(s => FALLBACK_OS.has(s.os) || s.url.includes(`hugo_extended_withdeploy_${HUGO_VERSION}_`))).toBe(true);
    expect(sources.every(s => !s.url.includes('other'))).toBe(true);
  });

  it('build tags from the env var and npm config are merged', async() => {
    process.env.HUGO_BIN_BUILD_TAGS = 'extended';
    process.env.npm_config_hugo_bin_build_tags = 'withdeploy';
    const sources = await getSources();

    expect(sources.every(s => FALLBACK_OS.has(s.os) || s.url.includes(`hugo_extended_withdeploy_${HUGO_VERSION}_`))).toBe(true);
  });

  it('env vars take precedence over npm config', async() => {
    process.env.HUGO_BIN_HUGO_VERSION = '0.110.0';
    process.env.npm_config_hugo_bin_hugo_version = '0.120.0';
    process.env.HUGO_BIN_DOWNLOAD_REPO = 'https://env.example.com';
    process.env.npm_config_hugo_bin_download_repo = 'https://npm.example.com';
    const sources = await getSources();

    expect(sources.every(s => s.url.startsWith('https://env.example.com/'))).toBe(true);
    expect(sources.every(s => s.url.includes('/v0.110.0/'))).toBe(true);
  });

  it('empty config values fall back to defaults', async() => {
    process.env.npm_config_hugo_bin_build_tags = '';
    process.env.npm_config_hugo_bin_download_repo = '';
    process.env.npm_config_hugo_bin_hugo_version = '';
    const sources = await getSources();

    expect(sources.every(s =>
      s.url.startsWith(`https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/`))).toBe(true);
  });

  it('uses the platform-specific binary name', async() => {
    const lib = await hugoBin(process.cwd());

    expect(lib.use()).toBe(process.platform === 'win32' ? 'hugo.exe' : 'hugo');
  });

  it('installs into the vendor directory', async() => {
    const lib = await hugoBin(process.cwd());

    expect(lib.dest()).toContain('vendor');
  });

  it('without verify, sources have no hash', async() => {
    const sources = await getSources();

    expect(sources.every(s => s.hash === undefined)).toBe(true);
  });

  it('verify option adds a matching sha256 hash to every source', async() => {
    const sources = await getSources({ verify: true });

    expect(sources.length).toBe(TARGETS.length);
    for (const source of sources) {
      expect(source.hash).toMatch(/^sha256:[\da-f]{64}$/);
    }
  });

  it('verify throws when the current platform artifact has no checksum entry', async() => {
    const { other } = await splitByCurrentPlatform();
    stubChecksums(other);

    await expect(hugoBin(process.cwd(), { verify: true })).rejects.toThrow('No checksum found for');
  });

  it('verify ignores missing checksum entries for other platforms', async() => {
    const { current } = await splitByCurrentPlatform();
    stubChecksums(current);

    const lib = await hugoBin(process.cwd(), { verify: true });
    const resolvedUrls = new Set(lib.resolvedUrls());
    const resolvedSources = lib.src().filter(s => resolvedUrls.has(s.url));

    expect(resolvedSources.every(s => s.hash === `sha256:${'a'.repeat(64)}`)).toBe(true);
  });
});
