import { strict as assert } from 'node:assert';
import process from 'node:process';
import binCheck from 'bin-check';
import { test, suite } from 'uvu';
import hugoBin from '../index.js';
import hugoLib from '../lib/index.js';

test('should return path to binary and work', () => {
  return binCheck(hugoBin, ['version']).then(works => {
    assert.ok(works);
  });
});

test.run();

/**
 * Verify Custom/Enterprise Repository overwrite.
 */

const hugoLibCustomRepoTestSuite = suite('hugo-bin overwrite download repository');

hugoLibCustomRepoTestSuite.before.each(() => {
  // Ensure that the environment is cleaned before next test run.
  delete process.env.npm_config_hugo_bin_build_tags;
  delete process.env.npm_config_hugo_bin_download_repo;
});

hugoLibCustomRepoTestSuite('verify test env', () => {
  assert.equal(process.env.npm_config_hugo_bin_build_tags, undefined);
  assert.equal(process.env.npm_config_hugo_bin_download_repo, undefined);
});

// Default Repository - Test Cases

hugoLibCustomRepoTestSuite('should return default repository url - Repository: default - Extended: undefined', () => {
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://github.com/'));
  });
});

hugoLibCustomRepoTestSuite('should return default repository url - Repository: default - Extended: empty', () => {
  process.env.npm_config_hugo_bin_build_tags = '';
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://github.com/'));
  });
});

hugoLibCustomRepoTestSuite('should return default repository url - Repository: default - Extended: extended', () => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://github.com/'));
  });
});

// Custom/Enterprise Repository Test Cases

hugoLibCustomRepoTestSuite('should return custom repository url - Repository: custom - Extended: undefined', () => {
  process.env.npm_config_hugo_bin_download_repo = 'https://some1.example.com';
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://some1.example.com/'));
  });
});

hugoLibCustomRepoTestSuite('should return custom repository url - Repository: custom - Extended: empty', () => {
  process.env.npm_config_hugo_bin_build_tags = '';
  process.env.npm_config_hugo_bin_download_repo = 'https://some2.example.com';
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://some2.example.com/'));
  });
});

hugoLibCustomRepoTestSuite('should return custom repository url - Repository: custom - Extended: extended', () => {
  process.env.npm_config_hugo_bin_build_tags = 'extended';
  process.env.npm_config_hugo_bin_download_repo = 'https://some3.example.com';
  const repoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  repoSources.forEach((sourceUrl) => {
    assert.ok(sourceUrl.startsWith('https://some3.example.com/'));
  });
});

hugoLibCustomRepoTestSuite.run();
