#!/usr/bin/env node

'use strict';

const { spawn } = require('child_process');
const hugo = require('.');

spawn(hugo, process.argv.slice(2), { stdio: 'inherit' })
  .on('exit', process.exit);
