#!/usr/bin/env node

'use strict';

const execa = require('execa');
const hugo = require('.');
const args = process.argv.slice(2);

execa(hugo, args).stdout.pipe(process.stdout);
