import { setTimeout as delay } from 'node:timers/promises';
import { debuglog } from 'node:util';

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
    const [digest, file] = line.trim().split(/\s+/);
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

    let response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT) });
    } catch(error) {
      debug('[fetchChecksums] attempt %d/%d errored: %s', attempt, FETCH_ATTEMPTS, error.message);
      if (isLastAttempt) {
        throw new Error(`Failed to fetch Hugo checksums: ${url} (${error.message})`, { cause: error });
      }

      await delay(backoff);
      continue;
    }

    if (response.ok) {
      return parseChecksums(await response.text());
    }

    if (response.status < 500 || isLastAttempt) {
      throw new Error(`Failed to fetch Hugo checksums (${response.status}): ${url}`);
    }

    debug('[fetchChecksums] attempt %d/%d got %d', attempt, FETCH_ATTEMPTS, response.status);
    await delay(backoff);
  }
}
/* eslint-enable no-await-in-loop */
