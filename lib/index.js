const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package');

const hugoVersion = pkg.hugoVersion;
const baseUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/`;
const binNameMap = {
  darwin: {
    arn: 'hugo',
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
  sunos: {
    x64: 'hugo'
  },
  win32: {
    ia32: 'hugo.exe',
    x64: 'hugo.exe'
  }
};
const binName = (binNameMap[process.platform] && binNameMap[process.platform][process.arch]) || '';

module.exports = new BinWrapper()
  .src(`${baseUrl}hugo_${hugoVersion}_freebsd-32bit.tgz`, 'freebsd', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_freebsd-64bit.tgz`, 'freebsd', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_freebsd-arm32.tgz`, 'freebsd', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_linux-32bit.tgz`, 'linux', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_linux-64bit.tgz`, 'linux', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_linux-arm32.tgz`, 'linux', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_osx-32bit.tgz`, 'darwin', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_osx-64bit.tgz`, 'darwin', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_darwin-arm32.tgz`, 'darwin', 'arm')
  .src(`${baseUrl}hugo_${hugoVersion}_solaris-64bit.tgz`, 'sunos', 'x64')
  .src(`${baseUrl}hugo_${hugoVersion}_windows-32bit.zip`, 'win32', 'x86')
  .src(`${baseUrl}hugo_${hugoVersion}_windows-64bit.zip`, 'win32', 'x64')
  .dest(path.join(__dirname, '../vendor'))
  .use(binName);
