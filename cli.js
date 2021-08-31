#!/usr/bin/env node

import execa from "execa";
import hugo from "./index.js";

const args = process.argv.slice(2);

execa(hugo, args, { stdio: "inherit" });
