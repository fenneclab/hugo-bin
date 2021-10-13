#!/usr/bin/env node

import { spawn } from "child_process";
import hugo from "../index.js";

const args = process.argv.slice(2);

spawn(hugo, args, { stdio: "inherit" })
  .on("exit", (code) => {
    // forward Hugo's exit code so this module itself reports success/failure
    process.exit(code);
  });
