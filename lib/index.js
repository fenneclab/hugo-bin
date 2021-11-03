'use strict';

const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkgConf = require('pkg-conf');
const { hugoVersion } = require('../package.json');

const baseUrl = `https://github.com/gohugoio/hugo/releases/download/v${hugoVersion}/`;
const destDir = path.join(__dirname, '../vendor/');
const binName = process.platform === 'win32' ? 'hugo.exe' : 'hugo';

const extendedBin = new BinWrapper()
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_macOS-all.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_macOS-all.tar.gz`, 'darwin', 'arm64')
  .src(`${baseUrl}hugo_extended_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  // Fall back to the normal version on unsupported platforms
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM64.tar.gz`, 'linux', 'arm64')
  .src(`${baseUrl}hugo_${hugoVersion}_NetBSD-64bit.tar.gz`, 'netbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_OpenBSD-64bit.tar.gz`, 'openbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-ARM.zip`, 'win32', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-ARM64.zip`, 'win32', 'arm64')
  .dest(destDir)
  .use(binName);

const normalBin = new BinWrapper()
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-ARM64.tar.gz`, 'linux', 'arm64')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-all.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-all.tar.gz`, 'darwin', 'arm64')
  .src(`${baseUrl}hugo_${hugoVersion}_NetBSD-64bit.tar.gz`, 'netbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_OpenBSD-64bit.tar.gz`, 'openbsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-ARM.zip`, 'win32', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-ARM64.zip`, 'win32', 'arm64')
  .dest(destDir)
  .use(binName);

module.exports = projectRoot => {
  const config = pkgConf.sync('hugo-bin', { cwd: projectRoot });
  const extended = (process.env.HUGO_BIN_BUILD_TAGS || process.env.npm_config_hugo_bin_build_tags || config.buildTags) === 'extended';
  return extended ? extendedBin : normalBin;
};
