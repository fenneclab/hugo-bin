import { setTimeout as delay } from 'node:timers/promises';
import { debuglog } from 'node:util';
import downloader from '@xhmikosr/downloader';

const debug = debuglog('hugo-bin');

const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT = 10_000;

/**
 Parse a Hugo `checksums.txt` body.

 @param {string} body Raw contents of the checksums file.
 @returns {Map<string, string>} Map of file name to sha256 digest.
 */
function parseChecksums(body) {
  const checksums = new Map();
  for (const line of body.split('\n')) {
    const [digest, file] = line.trim().split(/\s+/, 2);
    if (digest && file) {
      checksums.set(file, digest);
    }
  }

  return checksums;
}

/**
 Fetch Hugo's published checksums for a release, retrying transient failures
 (network errors, timeouts, 5xx responses) with backoff. A 4xx response
 (e.g. the version doesn't exist) fails immediately.

 Uses the same downloader as the archives, so npm's `strict-ssl` applies to both.

 @param {string} baseUrl Base URL the release archives are downloaded from.
 @param {string} hugoVersion Hugo version the checksums belong to, without a leading `v`.
 @returns {Promise<Map<string, string>>} Map of file name to sha256 digest.
 */
/* eslint-disable no-await-in-loop -- retries are sequential by design, each one waits on the last */
export async function fetchChecksums(baseUrl, hugoVersion) {
  const url = `${baseUrl}hugo_${hugoVersion}_checksums.txt`;

  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    const isLastAttempt = attempt === FETCH_ATTEMPTS;
    const backoff = (2 ** attempt) * 250;

    try {
      const data = await downloader(url, { got: { timeout: { request: FETCH_TIMEOUT } } });
      return parseChecksums(data.toString());
    } catch(error) {
      // got only sets `response` on HTTP errors, not on network errors or timeouts
      const status = error.response?.statusCode;
      debug('[fetchChecksums] attempt %d/%d failed: %s', attempt, FETCH_ATTEMPTS, error.message);

      if (isLastAttempt || (status !== undefined && status < 500)) {
        throw new Error(`Failed to fetch Hugo checksums: ${url} (${status ?? error.message})`, { cause: error });
      }
    }

    await delay(backoff);
  }
}
/* eslint-enable no-await-in-loop */
