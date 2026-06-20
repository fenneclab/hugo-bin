import process from 'node:process';
import binCheck from '@xhmikosr/bin-check';
import {
  beforeAll,
  describe,
  expect,
  it
} from 'vitest';
import hugoBin from '../lib/index.js';
import hugoPath from '../index.js';

describe('works', () => {
  beforeAll(async() => {
    // download the binary if it's not there yet
    const bin = await hugoBin(process.cwd());
    await bin.run(['version']);
  });

  it('should return path to binary and work', async() => {
    const works = await binCheck(hugoPath, ['version']);
    expect(works).toBe(true);
  });
});
