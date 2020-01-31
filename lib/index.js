'use strict';

const path = require('path');
const BinWrapper = require('bin-wrapper');
const { hugoVersion } = require('../package.json');

const baseUrl = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/`;

const binNameMap = {
  darwin: {
    ia32: 'hugo',
    x64: 'hugo'
  },
  freebsd: {
    arm: 'hugo',
    ia32: 'hugo',
    x64: 'hugo'
  },
  linux: {
    arm: 'hugo',
    ia32: 'hugo',
    x64: 'hugo'
  },
  win32: {
    ia32: 'hugo.exe',
    x64: 'hugo.exe'
  }
};

const dest = path.join(__dirname, '../vendor');
const binName = (binNameMap[process.platform] && binNameMap[process.platform][process.arch]) || '';

const extendedBin = new BinWrapper()
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_macOS-64bit.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  // Falling back to normal version on non supported platforms
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-32bit.tar.gz`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-ARM.tar.gz`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-32bit.tar.gz`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .dest(dest)
  .use(binName);

module.exports = function () {
  return extendedBin;
};
