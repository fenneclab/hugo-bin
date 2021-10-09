#!/usr/bin/env node

import { spawn } from "child_process";
import hugo from "../index.js";

const args = process.argv.slice(2);

spawn(hugo, args, { stdio: "inherit" })
  .on("exit", process.exit);
