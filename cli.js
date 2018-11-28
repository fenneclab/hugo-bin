#!/usr/bin/env node

'use strict';

const { spawn } = require('child_process');
const hugo = require('.');

const input = process.argv.slice(2);

spawn(hugo, input, { stdio: 'inherit' })
  .on('exit', process.exit);
