const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkgConf = require('pkg-conf');
const pkg = require('../package');

const config = pkgConf.sync('hugo-bin');
const hugoVersion = process.env.HUGO_BIN_VERSION || process.env.npm_config_hugo_bin_version || config.version || pkg.defaultHugoVersion;
const extended = process.env.HUGO_BIN_EXTENDED || process.env.npm_config_hugo_bin_extended || config.extended || false;
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
const binName = (binNameMap[process.platform] && binNameMap[process.platform][process.arch]) || '';
const srcPrefix = `hugo${extended ? '_extended' : ''}_${hugoVersion}_`;
module.exports = new BinWrapper()
  .src(`${baseUrl}${srcPrefix}_FreeBSD-32bit.tar.gz`, 'freebsd', 'x86')
  .src(`${baseUrl}${srcPrefix}_FreeBSD-64bit.tar.gz`, 'freebsd', 'x64')
  .src(`${baseUrl}${srcPrefix}_FreeBSD-ARM.tar.gz`, 'freebsd', 'arm')
  .src(`${baseUrl}${srcPrefix}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}${srcPrefix}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}${srcPrefix}_Linux-ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}${srcPrefix}_macOS-32bit.tar.gz`, 'darwin', 'x86')
  .src(`${baseUrl}${srcPrefix}_macOS-64bit.tar.gz`, 'darwin', 'x64')
  .src(`${baseUrl}${srcPrefix}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}${srcPrefix}_Windows-64bit.zip`, 'win32', 'x64')
  .dest(path.join(__dirname, '../vendor'))
  .use(binName);
