import { strict as assert } from 'node:assert';
import binCheck from 'bin-check';
import { test } from 'uvu';
import hugoBin from '../index.js';

test('should return path to binary and work', () => {
  return binCheck(hugoBin, ['version']).then(works => {
    assert.ok(works);
  });
});

test.run();
