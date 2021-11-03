/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const binCheck = require('bin-check');
const hugoBin = require('..');

describe('hugo-bin', () => {
  it('should return path to binary and work', () => {
    return binCheck(hugoBin, ['version']).then(works => {
      assert.ok(works);
    });
  });
});
