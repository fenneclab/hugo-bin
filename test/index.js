import process from "node:process";
import binCheck from "bin-check";
import { test } from "uvu";
import hugoBin from "../index.js";
import hugoLib from "../lib/index.js";
import * as assert from "uvu/assert";

test("should return path to binary and work", () => {
  return binCheck(hugoBin, ["version"]).then((works) => {
    assert.ok(works);
  });
});

test("should return overwritten repository url", () => {
  // Verify for Default Repository and Not Extended
  process.env.npm_config_hugo_bin_build_tags = "";
  const defaultRepoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  defaultRepoSources.forEach((sourceUrl) => {
    assert.is(sourceUrl.startsWith("https://github.com/"), true);
  });

  // Verify for Default Repository and Extended
  process.env.npm_config_hugo_bin_build_tags = "extended";
  const defaultRepoSourcesExtended = hugoLib(process.cwd())._src.map(
    (v) => v.url
  );
  defaultRepoSourcesExtended.forEach((sourceUrl) => {
    assert.is(sourceUrl.startsWith("https://github.com/"), true);
  });

  // Verify for Custom Repository and Not Extended
  process.env.npm_config_hugo_bin_build_tags = "";
  process.env.npm_config_hugo_bin_download_repo = "https://some.example.com";
  const customRepoSources = hugoLib(process.cwd())._src.map((v) => v.url);
  customRepoSources.forEach((sourceUrl) => {
    assert.is(sourceUrl.startsWith("https://some.example.com/"), true);
  });

  // Verify for Custom Repository and Extended
  process.env.npm_config_hugo_bin_build_tags = "extended";
  process.env.npm_config_hugo_bin_download_repo = "https://some.example.com";
  const customRepoSourcesExtended = hugoLib(process.cwd())._src.map(
    (v) => v.url
  );
  customRepoSourcesExtended.forEach((sourceUrl) => {
    assert.is(sourceUrl.startsWith("https://some.example.com/"), true);
  });
});

test.run();
