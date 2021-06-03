'use strict';

module.exports = require('path').join(
  __dirname,
  'vendor',
  process.platform === 'win32' ? 'hugo.exe' : 'hugo'
);
