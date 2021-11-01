/* eslint-env node, mocha */
import path from "path";
import { execFile } from "child_process";
import assert from "assert";
import del from "del";
import hugo from "../index.js";
import { getBinPath } from "../lib/utils.js";

it("Hugo exists and runs?", async function () {
  this.timeout(30000); // increase timeout to an excessive 30 seconds for CI

  const hugoPath = await hugo();

  assert(execFile(hugoPath, ["env"], function (error, stdout) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }));
});

it("Hugo doesn't exist, install it instead of throwing an error", async function () {
  this.timeout(30000); // increase timeout to an excessive 30 seconds for CI

  // delete binary to ensure it's auto-reinstalled
  await del(path.dirname(getBinPath()));

  const hugoPath = await hugo();

  assert(execFile(hugoPath, ["version"], function (error, stdout) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }));
});
