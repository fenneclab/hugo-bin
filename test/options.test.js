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

testSuite.run();
