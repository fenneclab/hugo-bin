'use strict';

const path = require('path');
const binWrapper = require('bin-wrapper');
const { hugoVersion } = require('../package.json');

const baseUrl = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/`;

// Default to extended Hugo, fall back to vanilla Hugo on unsupported platforms
const extendedBin = new binWrapper()
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_macOS-64bit.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-32bit.tar.gz`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-ARM.tar.gz`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-32bit.tar.gz`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .dest(path.join(__dirname, '../vendor'))
  .use(process.platform === 'win32' ? 'hugo.exe' : 'hugo');

// TODO: download checksums.txt file and validate package integrity

module.exports = function () {
  return extendedBin;
};
