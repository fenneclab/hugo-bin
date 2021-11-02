#!/usr/bin/env node

import { spawn } from "child_process";
import hugo from "../index.js";

(async () => {
  const args = process.argv.slice(2);
  const bin = await hugo();

  spawn(bin, args, { stdio: "inherit" })
    .on("exit", (code) => {
      // forward Hugo's exit code so this module itself reports success/failure
      process.exitCode = code;
    });
})();
