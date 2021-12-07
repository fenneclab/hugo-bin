'use strict';

const assert = require('assert').strict;
const binCheck = require('bin-check');
const hugoBin = require('..');
const { test } = require('uvu');

test('should return path to binary and work', () => {
  return binCheck(hugoBin, ['version']).then(works => {
    assert.ok(works);
  });
});

test.run();
