'use strict';

const path = require('path');
const BinWrapper = require('bin-wrapper');
const { hugoVersion } = require('../package.json');

const baseUrl = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/`;

// Default to extended Hugo, fall back to vanilla Hugo on unsupported platforms
module.exports = new BinWrapper()
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_macOS-64bit.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM64.tar.gz`, 'linux', 'arm64')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-32bit.tar.gz`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-32bit.tar.gz`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-ARM.tar.gz`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_NetBSD-64bit.tar.gz`, 'netbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_NetBSD-32bit.tar.gz`, 'netbsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_NetBSD-ARM.tar.gz`, 'netbsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_OpenBSD-64bit.tar.gz`, 'openbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_OpenBSD-32bit.tar.gz`, 'openbsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_OpenBSD-ARM.tar.gz`, 'openbsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_DragonFlyBSD-64bit.tar.gz`, 'dragonfly', 'x64')
  .dest(path.join(__dirname, '../vendor'))
  .use(process.platform === 'win32' ? 'hugo.exe' : 'hugo');
