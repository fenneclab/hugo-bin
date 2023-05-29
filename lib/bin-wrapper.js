import crypto from 'node:crypto';
import { chmod, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import BinWrapperBase from '@xhmikosr/bin-wrapper';
import decompress from '@xhmikosr/decompress';
import download from '@xhmikosr/downloader';
import osFilterObj from 'os-filter-obj';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const checksumPath = path.join(__dirname, '../hugo-checksums.txt');

export default class BinWrapper extends BinWrapperBase {
  /**
   * Override original download() to check checksum before download and after decompress
   */
  download() {
    const files = osFilterObj(this.src() || []);

    if (files.length === 0) {
      return Promise.reject(new Error('No binary found matching your system. It\'s probably not supported.'));
    }

    const fileUrl = files[0].url;
    const parsedUrl = new URL(fileUrl);
    const parsedPath = path.parse(parsedUrl.pathname);
    const fileBaseName = parsedPath.base;

    return Promise.all([download(fileUrl), readFile(checksumPath, 'utf8')])
      .then(([data, checksums]) => {
        const lines = checksums.split('\n');
        // parsing goreleaser checksum format
        // see: https://github.com/goreleaser/goreleaser/blob/master/internal/pipe/checksums/checksums.go#L81
        const found = lines.map(line => line.split('  '))
          .find(([, baseName]) => baseName === fileBaseName);

        if (!found) {
          throw new Error('No checksum found.');
        }

        const checksum = found[0];
        if (crypto.createHash('sha256').update(data).digest('hex') !== checksum) {
          throw new Error('Hugo binary checksum does not match.');
        }

        return decompress(data, this.dest(), { strip: this.options.strip });
      })
      .then(files => {
        return Promise.all(
          files.map(file => file.path).map(file => chmod(path.join(this.dest(), file), 0o755))
        );
      });
  }
}
