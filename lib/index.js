const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package');

const hugoVersion = pkg.hugoVersion;
const baseUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/`;
const binNameMap = {
  darwin: {
    ia32: `hugo_${hugoVersion}_darwin_386`,
    x64: `hugo_${hugoVersion}_darwin_amd64`
  },
  freebsd: {
    arm: `hugo_${hugoVersion}_freebsd_arm`,
    ia32: `hugo_${hugoVersion}_freebsd_386`,
    x64: `hugo_${hugoVersion}_freebsd_amd64`
  },
  linux: {
    arm: `hugo_${hugoVersion}_linux_arm`,
    ia32: `hugo_${hugoVersion}_linux_386`,
    x64: `hugo_${hugoVersion}_linux_amd64`
  },
  win32: {
    ia32: `hugo_${hugoVersion}_windows_386.exe`,
    x64: `hugo_${hugoVersion}_windows_amd64.exe`
  }
};
const binName = (binNameMap[process.platform] && binNameMap[process.platform][process.arch]) || '';

module.exports = new BinWrapper()
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-32bit.zip`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD-64bit.zip`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_FreeBSD_ARM.zip`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-32bit.tar.gz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux-64bit.tar.gz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Linux_ARM.tar.gz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-32bit.zip`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_macOS-64bit.zip`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_Windows-64bit.zip`, 'win32', 'x64')
  .dest(path.join(__dirname, '../vendor'))
  .use(binName);
