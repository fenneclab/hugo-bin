const _ = require('lodash');
const assert = require('assert');
const getBinalyName = require('../lib/getBinalyName');

describe('#getBinalyName', () => {
  _.flatMapDeep([
    ['0.10', '0.11', '0.12', '0.13', '0.14', '0.15'].map(version => [{
      version,
      platform: 'darwin',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_darwin_386.zip`,
        exe: `hugo_${version}_darwin_386`
      }
    }, {
      version,
      platform: 'darwin',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_darwin_amd64.zip`,
        exe: `hugo_${version}_darwin_amd64`
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'arm',
      expected: {
        comp: `hugo_${version}_freebsd_arm.zip`,
        exe: `hugo_${version}_freebsd_arm`
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_freebsd_386.zip`,
        exe: `hugo_${version}_freebsd_386`
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_freebsd_amd64.zip`,
        exe: `hugo_${version}_freebsd_amd64`
      }
    }, {
      version,
      platform: 'linux',
      arch: 'arm',
      expected: {
        comp: `hugo_${version}_linux_arm.tar.gz`,
        exe: `hugo_${version}_linux_arm`
      }
    }, {
      version,
      platform: 'linux',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_linux_386.tar.gz`,
        exe: `hugo_${version}_linux_386`
      }
    }, {
      version,
      platform: 'linux',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_linux_amd64.tar.gz`,
        exe: `hugo_${version}_linux_amd64`
      }
    }, {
      version,
      platform: 'win32',
      arch: 'ia32',
      expected: {
        comp: version === '0.15' ? `hugo_${version}_windows_386_32-bit-only.zip` : `hugo_${version}_windows_386.zip`,
        exe: `hugo_${version}_windows_386.exe`
      }
    }, {
      version,
      platform: 'win32',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_windows_amd64.zip`,
        exe: `hugo_${version}_windows_amd64.exe`
      }
    }]),
    ['0.16'].map(version => [{
      version,
      platform: 'darwin',
      arch: 'arm',
      expected: {
        comp: `hugo_${version}_darwin-arm32.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'darwin',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_osx-32bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'darwin',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_osx-64bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'arm',
      expected: {
        comp: `hugo_${version}_freebsd-arm32.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_freebsd-32bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'freebsd',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_freebsd-64bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'linux',
      arch: 'arm',
      expected: {
        comp: `hugo_${version}_linux-arm64.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'linux',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_linux-32bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'linux',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_linux-64bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'sunos',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_solaris-64bit.tgz`,
        exe: 'hugo'
      }
    }, {
      version,
      platform: 'win32',
      arch: 'ia32',
      expected: {
        comp: `hugo_${version}_windows-32bit.zip`,
        exe: 'hugo.exe'
      }
    }, {
      version,
      platform: 'win32',
      arch: 'x64',
      expected: {
        comp: `hugo_${version}_windows-64bit.zip`,
        exe: 'hugo.exe'
      }
    }])
  ]).forEach(test => {
    it(`should return hugo binaly name with version: ${test.version}, platform: ${test.platform}, arch: ${test.arch}`, () => {
      assert.deepStrictEqual(getBinalyName(test.version, test.platform, test.arch), test.expected);
    });
  });

  ['0.9', '0.8', '0.7'].forEach(v => {
    it(`should throw error when path an unsupported hugoVersion: ${v}`, () => {
      try {
        getBinalyName(v, process.platform, process.arch);
        assert.fail('unexpected success');
      } catch (err) {
        assert(err instanceof Error);
        assert.strictEqual(err.message, `hugoVersion<0.10 is not supported: ${v}`);
      }
    });
  });

  _.flatMapDeep([
    ['0.10', '0.11', '0.12', '0.13', '0.14', '0.15'].map(version => [{
      version,
      platform: 'darwin',
      arch: 'arn'
    }, {
      version,
      platform: 'sunos',
      arch: 'x64'
    }])
  ]).forEach(test => {
    it(`should throw error when path an unsupported version: ${test.version}, platform: ${test.platform}, arch: ${test.arch}`, () => {
      try {
        getBinalyName(test.version, test.platform, test.arch);
        assert.fail('unexpected success');
      } catch (err) {
        assert(err instanceof Error);
        assert.strictEqual(err.message, `Can't detect binaly name. Check your platform: ${test.platform}, arch: ${test.arch}, version: ${test.version}.
For more info: https://github.com/fenneclab/hugo-bin/blob/master/test/getBinalyName.js`);
      }
    });
  });

});
