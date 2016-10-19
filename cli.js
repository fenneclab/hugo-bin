#!/usr/bin/env node

const spawn = require('child_process').spawn;
const input = process.argv.slice(2);
const hugo = require('./');

spawn(hugo, input, {stdio: 'inherit'})
  .on('exit', process.exit);
