import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { beforeEach, describe, it } from 'node:test';
import hugoBin from '../lib/index.js';

const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await readFile(pkg, 'utf8'));

const environmentVariables = [
  'HUGO_BIN_BUILD_TAGS',
  'npm_config_hugo_bin_build_tags',
  'HUGO_BIN_DOWNLOAD_REPO',
  'npm_config_hugo_bin_download_repo',
  'HUGO_BIN_HUGO_VERSION',
  'npm_config_hugo_bin_hugo_version'
];

describe('options', () => {
  beforeEach(() => {
    for (const variable of environmentVariables) {
      // Ensure that the environment is cleaned before next test run.
      delete process.env[variable];
    }
  });

  it('verify test env', () => {
    for (const variable of environmentVariables) {
      assert.equal(process.env[variable], undefined);
    }
  });

  describe('should return default repository url', () => {
    it('Repository: default - Extended: undefined', async() => {
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://github.com/'), true);
      }
    });

    it('Repository: default - Extended: empty', async() => {
      process.env.npm_config_hugo_bin_build_tags = '';
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://github.com/'), true);
      }
    });

    it('Repository: default - Extended: extended', async() => {
      process.env.npm_config_hugo_bin_build_tags = 'extended';
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://github.com/'), true);
      }
    });

    // Custom/Enterprise Repository Test Cases
    it('Repository: custom - Extended: undefined', async() => {
      process.env.npm_config_hugo_bin_download_repo = 'https://some1.example.com';
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://some1.example.com/'), true);
      }
    });

    it('Repository: custom - Extended: empty', async() => {
      process.env.npm_config_hugo_bin_build_tags = '';
      process.env.npm_config_hugo_bin_download_repo = 'https://some2.example.com';
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://some2.example.com/'), true);
      }
    });

    it('Repository: custom - Extended: extended', async() => {
      process.env.npm_config_hugo_bin_build_tags = 'extended';
      process.env.npm_config_hugo_bin_download_repo = 'https://some3.example.com';
      const lib = await hugoBin(process.cwd());
      const repoSources = lib._src.map(v => v.url);

      for (const sourceUrl of repoSources) {
        assert.equal(sourceUrl.startsWith('https://some3.example.com/'), true);
      }
    });
  });

  it('should return default version', async() => {
    const lib = await hugoBin(process.cwd());
    const repoSources = lib._src.map(v => v.url);

    for (const sourceUrl of repoSources) {
      assert.equal(sourceUrl.startsWith(`https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/`), true);
    }
  });

  it('should return custom version', async() => {
    process.env.npm_config_hugo_bin_hugo_version = '122.0';
    const lib = await hugoBin(process.cwd());
    const repoSources = lib._src.map(v => v.url);

    for (const sourceUrl of repoSources) {
      assert.equal(sourceUrl.startsWith('https://github.com/gohugoio/hugo/releases/download/v122.0/'), true);
    }
  });

  it('should strip `v` from custom version', async() => {
    process.env.npm_config_hugo_bin_hugo_version = 'v122.0';
    const lib = await hugoBin(process.cwd());
    const repoSources = lib._src.map(v => v.url);

    for (const sourceUrl of repoSources) {
      assert.equal(sourceUrl.startsWith('https://github.com/gohugoio/hugo/releases/download/v122.0/'), true);
    }
  });
});
