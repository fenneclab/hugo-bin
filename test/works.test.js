import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import binCheck from '@xhmikosr/bin-check';
import hugoPath from '../index.js';

describe('works', () => {
  it('should return path to binary and work', () => {
    return binCheck(hugoPath, ['version']).then(works => {
      assert.ok(works);
    });
  });
});
