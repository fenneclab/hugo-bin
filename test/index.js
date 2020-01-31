/* eslint-env mocha */

'use strict';

const assert = require('assert');
const binCheck = require('bin-check');
const hugoBin = require('..');
const { execFile } = require('child_process');

it('Hugo exists and runs?', () => {
  return binCheck(hugoBin, ['version']).then(works => {
    assert(works);

    // Print additional build environment variables if check successful
    if (works) {
      execFile(hugoBin, ['env'], (error, stdout) => {
        if (error) throw error;
        console.log(stdout);
      });
    }
  });
});
