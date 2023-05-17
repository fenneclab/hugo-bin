import process from 'node:process';
import binCheck from 'bin-check';
import { suite } from 'uvu';
import * as assert from 'uvu/assert'; // eslint-disable-line n/file-extension-in-import
import hugoPath from '../index.js';
import hugoBin from '../lib/index.js';

const worksSuite = suite('works');

worksSuite('should return path to binary and work', async() => {
  const works = await binCheck(hugoPath, ['version']);
  assert.is(works, true);
});

worksSuite.run();

/**
 * Verify Custom/Enterprise Repository overwrite.
 */
const customRepoSuite = suite('overwrites download repository');

customRepoSuite.before.each(() => {
  // Ensure that the environment is cleaned before next test run.
  delete process.env.npm_config_hugo_bin_build_tags;
  delete process.env.npm_config_hugo_bin_download_repo;
});

customRepoSuite('verify test env', () => {
  assert.is(process.env.npm_config_hugo_bin_build_tags, undefined);
  assert.is(process.env.npm_config_hugo_bin_download_repo, undefined);
});

// Default Repository - Test Cases
customRepoSuite('should return default repository url - Repository: default - Extended: undefined', async() => {
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

customRepoSuite('should return default repository url - Repository: default - Extended: empty', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

customRepoSuite('should return default repository url - Repository: default - Extended: extended', async() => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://github.com/'), true);
  }
});

// Custom/Enterprise Repository Test Cases
customRepoSuite('should return custom repository url - Repository: custom - Extended: undefined', async() => {
  process.env.npm_config_hugo_bin_download_repo = 'https://some1.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some1.example.com/'), true);
  }
});

customRepoSuite('should return custom repository url - Repository: custom - Extended: empty', async() => {
  process.env.npm_config_hugo_bin_build_tags = '';
  process.env.npm_config_hugo_bin_download_repo = 'https://some2.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some2.example.com/'), true);
  }
});

customRepoSuite('should return custom repository url - Repository: custom - Extended: extended', async() => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  process.env.npm_config_hugo_bin_download_repo = 'https://some3.example.com';
  const lib = await hugoBin(process.cwd());
  const repoSources = lib._src.map(v => v.url);

  for (const sourceUrl of repoSources) {
    assert.is(sourceUrl.startsWith('https://some3.example.com/'), true);
  }
});

customRepoSuite.run();
