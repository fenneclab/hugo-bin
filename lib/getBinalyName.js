const PLATFORMS = {
  darwin: 'darwin',
  freebsd: 'freebsd',
  linux: 'linux',
  // sunos: '', not supported
  win32: 'windows'
};

const ARCHS = {
  arm: 'arm',
  ia32: '386',
  x64: 'amd64'
};

const COMPS = {
  darwin: '.zip',
  freebsd: '.zip',
  linux: '.tar.gz',
  // sunos: '', not supported
  win32: '.zip'
};

const EXES = {
  darwin: '',
  freebsd: '',
  linux: '',
  // sunos: '', not supported
  win32: 'windows'
};

module.exports = version => {
  const platform = PLATFORMS[process.platform];
  const arch = ARCHS[process.arch];
  const comp = COMPS[process.platform];
  const exe = EXES[process.platform];
  return {
    binaryName: `hugo_${version}_${platform}_${arch}`,
    comp,
    exe
  };
}
