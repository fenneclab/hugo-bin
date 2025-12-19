/* global it, assert -- Globals defined by Mocha */
import path from "path";
import { execFile } from "child_process";
import assert from "assert";
import { deleteAsync } from "del";
import hugo from "../index.js";
import { getBinPath } from "../lib/utils.js";

it("Hugo exists and runs?", async function () {
  this.timeout(30000); // increase timeout to an excessive 30 seconds for CI

  const hugoPath = await hugo();

  // Wrap execFile in a Promise to ensure it completes before the test finishes
  await new Promise((resolve, reject) => {
    execFile(hugoPath, ["env"], function (error, stdout) {
      if (error) {
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
});

it("Hugo doesn't exist, install it instead of throwing an error", async function () {
  this.timeout(30000); // increase timeout to an excessive 30 seconds for CI

  // On macOS, the binary is installed to /usr/local/bin, which we can't/shouldn't delete.
  // We also can't easily test the reinstall flow without sudo.
  if (process.platform === "darwin") {
    console.log("Skipping reinstall test on macOS (requires sudo/system modification)");
    this.skip();
    return;
  }

  // delete binary to ensure it's auto-reinstalled
  // Note: On Windows, we delete the specific file because deleting the directory often causes EPERM/locking issues
  if (process.platform === "win32") {
    // Retry logic for Windows EPERM issues
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await deleteAsync(getBinPath(), { force: true });
        break;
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } else {
    await deleteAsync(path.dirname(getBinPath()), { force: true });
  }

  const hugoPath = await hugo();

  assert(execFile(hugoPath, ["version"], function (error, stdout) {
    if (error) {
      throw error;
    }

    console.log(stdout);
  }));
});
