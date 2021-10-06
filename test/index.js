/* eslint-env node, mocha */

import { execFile } from "child_process";
import assert from "assert";
import hugo from "../index.js";

it("Hugo exists and runs?", async function () {
  this.timeout(30000); // increase timeout to an excessive 30 seconds for CI

  assert(execFile(hugo, ["env"], function (error, stdout) {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }));
});
