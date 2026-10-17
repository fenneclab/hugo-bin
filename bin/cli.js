#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';
import hugoPath from '../index.js';

if (!existsSync(hugoPath)) {
  console.error('Hugo binary not found, hugo-bin\'s postinstall script didn\'t run.');
  console.error('Run `npm rebuild hugo-bin`, after `npm approve-scripts hugo-bin` if your npm blocks install scripts.');
  process.exit(1);
}

const input = process.argv.slice(2);

spawn(hugoPath, input, { stdio: 'inherit' })
  .on('exit', process.exit);
