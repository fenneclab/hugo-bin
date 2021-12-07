#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';
import hugo from './index.js';

const input = process.argv.slice(2);

spawn(hugo, input, { stdio: 'inherit' })
  .on('exit', process.exit);
