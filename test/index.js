/* eslint-env node, mocha */

import { execFile } from "child_process";
import assert from "assert";
import hugo from "../index.js";

it("Hugo exists and runs?", async () => {
  assert(execFile(hugo, ["env"], (error, stdout) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  }));
});
