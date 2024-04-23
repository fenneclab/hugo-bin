import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import binCheck from '@xhmikosr/bin-check';
import hugoPath from '../index.js';

describe('works', () => {
  it('should return path to binary and work', async() => {
    const works = await binCheck(hugoPath, ['version']);
    assert.equal(works, true);
  });
});
