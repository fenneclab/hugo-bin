const semver = require('semver');
// see: https://github.com/spf13/hugo/releases

const packageMap = version => ({
  darwin: {
    arm: `hugo_${version}_darwin-arm32.tgz`,
    ia32: `hugo_${version}_osx-32bit.tgz`,
    x64: `hugo_${version}_osx-64bit.tgz`
  },
  freebsd: {
    arm: `hugo_${version}_freebsd-arm32.tgz`,
    ia32: `hugo_${version}_freebsd-32bit.tgz`,
    x64: `hugo_${version}_freebsd-64bit.tgz`
  },
  linux: {
    arm: `hugo_${version}_linux-arm64.tgz`,
    ia32: `hugo_${version}_linux-32bit.tgz`,
    x64: `hugo_${version}_linux-64bit.tgz`
  },
  sunos: {
    x64: `hugo_${version}_solaris-64bit.tgz`
  },
  win32: {
    ia32: `hugo_${version}_windows-32bit.zip`,
    x64: `hugo_${version}_windows-64bit.zip`
  }
});

const legacyPackageMap = version => ({
  darwin: {
    ia32: `hugo_${version}_darwin_386.zip`,
    x64: `hugo_${version}_darwin_amd64.zip`
  },
  freebsd: {
    arm: `hugo_${version}_freebsd_arm.zip`,
    ia32: `hugo_${version}_freebsd_386.zip`,
    x64: `hugo_${version}_freebsd_amd64.zip`
  },
  linux: {
    arm: `hugo_${version}_linux_arm.tar.gz`,
    ia32: `hugo_${version}_linux_386.tar.gz`,
    x64: `hugo_${version}_linux_amd64.tar.gz`
  },
  sunos: {}, // not supported
  win32: {
    ia32: `hugo_${version}_windows_386.zip`,
    x64: `hugo_${version}_windows_amd64.zip`
  }
});

module.exports = (version, plat, arch) => {
  const validSemverVersion = `${version}.0`;
  if (semver.lt(validSemverVersion, '0.10.0')) {
    throw new Error(`hugoVersion<0.10 is not supported: ${version}`);
  }
  // exceptionally when...
  if (version === '0.15' && plat === 'win32' && arch === 'ia32') {
    return {
      comp: 'hugo_0.15_windows_386_32-bit-only.zip',
      exe: 'hugo_0.15_windows_386.exe'
    }
  }
  const isLegacy = semver.lte(validSemverVersion, '0.15.0');
  const comp = isLegacy ? legacyPackageMap(version)[plat][arch] : packageMap(version)[plat][arch];
  if (!comp) {
    throw new Error(`Can't detect binaly name. Check your platform: ${plat}, arch: ${arch}, version: ${version}.
For more info: https://github.com/fenneclab/hugo-bin/blob/master/test/getBinalyName.js`);
  }
  const exe = (isLegacy ? `${comp.replace(/\.zip|\.tar\.gz/, '')}` : 'hugo') + (plat === 'win32' ? '.exe' : '');
  return {
    comp,
    exe
  };
}
