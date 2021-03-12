'use strict';

const path = require('path');
const BinWrapper = require('bin-wrapper');
const src = require('./src');

module.exports = new BinWrapper()
  .src(src)
  .dest(path.join(__dirname, '../vendor'))
  .use(process.platform === 'win32' ? 'hugo.exe' : 'hugo');
