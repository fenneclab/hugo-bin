'use strict';

const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkgConf = require('pkg-conf');
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
  android: {
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

const normalBin = new BinWrapper()
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-32bit.tar.gz`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-ARM.tar.gz`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-32bit.tar.gz`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-64bit.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  .dest(dest)
  .use(binName);

module.exports = projectRoot => {
  const config = pkgConf.sync('hugo-bin', { cwd: projectRoot });
  const extended = (process.env.HUGO_BIN_BUILD_TAGS || process.env.npm_config_hugo_bin_build_tags || config.buildTags) === 'extended';
  return extended ? extendedBin : normalBin;
};
