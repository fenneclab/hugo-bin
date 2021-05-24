'use strict';

const { version } = require('../package.json');
const baseUrl = `https://github.com/gohugoio/hugo/releases/download/v${version}/`;

// Platforms: https://nodejs.org/api/process.html#process_process_platform
// Architectures: https://nodejs.org/api/process.html#process_process_arch

// Hugo Extended supports: macOS x64, macOS ARM64, Linux x64, Windows x64.
// all other combos fall back to vanilla Hugo.

module.exports =
  process.platform === 'darwin' && process.arch === 'x64'
    ? `${baseUrl}hugo_extended_${version}_macOS-64bit.tar.gz` :
  process.platform === 'darwin' && process.arch === 'arm64'
    ? `${baseUrl}hugo_extended_${version}_macOS-ARM64.tar.gz` :

  process.platform === 'win32' && process.arch === 'x64'
    ? `${baseUrl}hugo_extended_${version}_Windows-64bit.zip` :
  process.platform === 'win32' && process.arch.endsWith('32')
    ? `${baseUrl}hugo_${version}_Windows-32bit.zip` :

  process.platform === 'linux' && process.arch === 'x64'
    ? `${baseUrl}hugo_extended_${version}_Linux-64bit.tar.gz` :
  process.platform === 'linux' && process.arch.endsWith('32')
    ? `${baseUrl}hugo_${version}_Linux-32bit.tar.gz` :
  process.platform === 'linux' && process.arch === 'arm'
    ? `${baseUrl}hugo_${version}_Linux-ARM.tar.gz` :
  process.platform === 'linux' && process.arch === 'arm64'
    ? `${baseUrl}hugo_${version}_Linux-ARM64.tar.gz` :

  process.platform === 'freebsd' && process.arch === 'x64'
    ? `${baseUrl}hugo_${version}_FreeBSD-64bit.tar.gz` :
  process.platform === 'freebsd' && process.arch.endsWith('32')
    ? `${baseUrl}hugo_${version}_FreeBSD-32bit.tar.gz` :
  process.platform === 'freebsd' && process.arch === 'arm'
    ? `${baseUrl}hugo_${version}_FreeBSD-ARM.tar.gz` :
  process.platform === 'freebsd' && process.arch === 'arm64'
    ? `${baseUrl}hugo_${version}_FreeBSD-ARM64.tar.gz` :

  process.platform === 'openbsd' && process.arch === 'x64'
    ? `${baseUrl}hugo_${version}_OpenBSD-64bit.tar.gz` :
  process.platform === 'openbsd' && process.arch.endsWith('32')
    ? `${baseUrl}hugo_${version}_OpenBSD-32bit.tar.gz` :
  process.platform === 'openbsd' && process.arch === 'arm'
    ? `${baseUrl}hugo_${version}_OpenBSD-ARM.tar.gz` :
  process.platform === 'openbsd' && process.arch === 'arm64'
    ? `${baseUrl}hugo_${version}_OpenBSD-ARM64.tar.gz` :

  null;
