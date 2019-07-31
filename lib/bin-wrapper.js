
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');
const BinWrapperBase = require('bin-wrapper');
const importLazy = require('import-lazy')(require);
const decompress = importLazy('decompress');
const download = importLazy('download');
const osFilterObj = importLazy('os-filter-obj');

const checksumPath = path.join(__dirname, '../hugo-checksums.txt');

function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  })
}
function chmodAsync(filePath, mode) {
  return new Promise((resolve, reject) => {
    fs.chmod(filePath, mode, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
module.exports = class BinWrapper extends BinWrapperBase {
	/**
	 * Override original download() to check checksum before download and after decompress
	 */
  download() {
    const files = osFilterObj(this.src() || []);

    if (files.length === 0) {
      return Promise.reject(new Error('No binary found matching your system. It\'s probably not supported.'));
    }
    const fileUrl = files[0].url;
    const parsedUrl = url.parse(fileUrl);
    const parsedPath = path.parse(parsedUrl.pathname);
    const fileBaseName = parsedPath.base;

    return Promise.all([
      download(fileUrl),
      readFileAsync(checksumPath)
    ])
    .then(([data, checksums]) => {
      const lines = checksums.split('\n');
      const found = lines.map(line => {
        // parsing goreleaser checksum format
        // see: https://github.com/goreleaser/goreleaser/blob/master/internal/pipe/checksums/checksums.go#L81
        return line.split('  ');
      }).find(([,baseName]) => {
        return baseName === fileBaseName;
      });
      if (!found) {
        return Promise.reject(new Error('No checksum found.'));
      }
      const checksum = found[0];
      if (crypto.createHash('sha256').update(data).digest('hex') !== checksum) {
        return Promise.reject(new Error('Hugo binary checksum does not match.'));
      }
      return decompress(data, this.dest(), { strip: this.options.strip });
    })
    .then(files => {
      return Promise.all(files.map(file => file.path).map(fileName => {
        return chmodAsync(path.join(this.dest(), fileName), 0o755);
      }));
    });
  }
}
