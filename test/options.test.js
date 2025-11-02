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

const testSuite = suite('options');

testSuite.before.each(() => {
  for (const variable of environmentVariables) {
    // Ensure that the environment is cleaned before next test run.
    delete process.env[variable];
  }
});

testSuite('verify test env', () => {
  for (const variable of environmentVariables) {
    assert.is(process.env[variable], undefined);
  }
});

// Default Repository - Test Cases
testSuite('should return default repository url - Repository: default - Extended: undefined', async() => {
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

testSuite('should return default repository url - Repository: default - Extended: empty', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

testSuite('should return default repository url - Repository: default - Extended: extended', async() => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

// Custom/Enterprise Repository Test Cases
testSuite('should return custom repository url - Repository: custom - Extended: undefined', async() => {
  process.env.npm_config_hugo_bin_download_repo = 'https://some1.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some1.example.com/'), true);
  }
});

testSuite('should return custom repository url - Repository: custom - Extended: empty', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  process.env.npm_config_hugo_bin_download_repo = 'https://some2.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some2.example.com/'), true);
  }
});

testSuite('should return custom repository url - Repository: custom - Extended: extended', async() => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  process.env.npm_config_hugo_bin_download_repo = 'https://some3.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some3.example.com/'), true);
  }
});

testSuite('should return default version', async() => {
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith(`https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/`), true);
  }
});

testSuite('should return custom version', async() => {
  process.env.npm_config_hugo_bin_hugo_version = '122.0';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/gohugoio/hugo/releases/download/v122.0/'), true);
  }
});

testSuite('should strip `v` from custom version', async() => {
  process.env.npm_config_hugo_bin_hugo_version = 'v122.0';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib.src().map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/gohugoio/hugo/releases/download/v122.0/'), true);
  }
});

testSuite('extended+withdeploy build tags should include _withdeploy in artifact names', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended,withdeploy';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should include extended artifact names with withdeploy suffix
  assert.ok(urls.some(u => u.includes(`hugo_extended_withdeploy_${HUGO_VERSION}`)));
});

testSuite('extended without withdeploy tags should be extended only artifact names', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should include extended artifact names with withdeploy suffix
  assert.ok(urls.some(u => u.includes(`hugo_extended_${HUGO_VERSION}`)));
});

testSuite('withdeploy without extended should not change normal artifacts', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'withdeploy';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should use normal artifacts, no extended or withdeploy in names
  assert.ok(urls.every(u => u.includes(`hugo_${HUGO_VERSION}_`)));
  assert.ok(urls.every(u => !u.includes('hugo_extended_')));
  assert.ok(urls.every(u => !u.includes('_withdeploy')));
});

testSuite('no tags should be normal artifact names', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = '';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should use normal artifacts, no extended or withdeploy in names
  assert.ok(urls.every(u => u.includes(`hugo_${HUGO_VERSION}_`)));
  assert.ok(urls.every(u => !u.includes('hugo_extended_')));
  assert.ok(urls.every(u => !u.includes('_withdeploy')));
});

// Additional environment variable tests
testSuite('should handle HUGO_BIN_BUILD_TAGS environment variable', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  assert.ok(urls.some(u => u.includes('hugo_extended_')));
});

testSuite('should handle HUGO_BIN_DOWNLOAD_REPO environment variable', async() => {
  process.env.HUGO_BIN_DOWNLOAD_REPO = 'https://custom-repo.example.com';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  assert.ok(urls.every(u => u.startsWith('https://custom-repo.example.com/')));
});

testSuite('should handle HUGO_BIN_HUGO_VERSION environment variable', async() => {
  process.env.HUGO_BIN_HUGO_VERSION = '0.100.0';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  assert.ok(urls.every(u => u.includes('v0.100.0')));
});

testSuite('should handle HUGO_BIN_HUGO_VERSION with leading v', async() => {
  process.env.HUGO_BIN_HUGO_VERSION = 'v0.101.0';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should strip the v and use 0.101.0
  assert.ok(urls.every(u => u.includes('v0.101.0')));
  assert.ok(urls.every(u => !u.includes('vv0.101.0')));
});

testSuite('should handle multiple build tags', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended, withdeploy, other';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should include both extended and withdeploy
  assert.ok(urls.some(u => u.includes('hugo_extended_withdeploy_')));
});

testSuite('should handle build tags with extra whitespace', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = '  extended  ,  withdeploy  ';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  assert.ok(urls.some(u => u.includes('hugo_extended_withdeploy_')));
});

testSuite('should handle build tags with mixed case', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'Extended,WithDeploy';
  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should normalize to lowercase
  assert.ok(urls.some(u => u.includes('hugo_extended_withdeploy_')));
});

testSuite('should generate correct URLs for all platforms', async() => {
  const lib = await hugoBin(process.cwd());
  const sources = lib.src();

  // Verify we have sources for different platforms
  const platforms = new Set(sources.map(s => s.os));

  // Should include darwin, linux, and win32 at minimum
  assert.ok(platforms.has('darwin'));
  assert.ok(platforms.has('linux'));
  assert.ok(platforms.has('win32'));
});

testSuite('should generate correct URLs for different architectures', async() => {
  const lib = await hugoBin(process.cwd());
  const sources = lib.src();

  const architectures = new Set(sources.map(s => s.arch));

  // Should include x64 and arm64 at minimum
  assert.ok(architectures.has('x64'));
  assert.ok(architectures.has('arm64'));
});

testSuite('should use correct binary name based on platform', async() => {
  const lib = await hugoBin(process.cwd());
  const binName = lib.use();

  if (process.platform === 'win32') {
    assert.is(binName, 'hugo.exe');
  } else {
    assert.is(binName, 'hugo');
  }
});

testSuite('should set correct destination directory', async() => {
  const lib = await hugoBin(process.cwd());
  const dest = lib.dest();

  assert.ok(dest.includes('vendor'));
});

testSuite('should handle empty npm_config variables', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  process.env.npm_config_hugo_bin_download_repo = '';
  process.env.npm_config_hugo_bin_hugo_version = '';

  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // Should fall back to defaults
  assert.ok(urls.every(u => u.includes(`v${HUGO_VERSION}`)));
  assert.ok(urls.every(u => u.startsWith('https://github.com/')));
});

testSuite('should prioritize environment variables over npm config', async() => {
  process.env.HUGO_BIN_BUILD_TAGS = 'extended';
  process.env.npm_config_hugo_bin_build_tags = 'withdeploy';

  const lib = await hugoBin(process.cwd());
  const urls = lib.src().map(v => v.url);

  // HUGO_BIN_BUILD_TAGS should take precedence
  assert.ok(urls.some(u => u.includes('hugo_extended_')));
});

testSuite('should include fallback platforms', async() => {
  const lib = await hugoBin(process.cwd());
  const sources = lib.src();

  // Check that we have more sources than just the main platforms
  // This ensures fallback platforms are included
  assert.ok(sources.length > 7); // darwin(2) + linux(3) + win32(2) = 7
});

testSuite.run();
