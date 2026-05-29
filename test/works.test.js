import process from 'node:process';
import binCheck from '@xhmikosr/bin-check';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import hugoBin from '../lib/index.js';
import hugoPath from '../index.js';

const testSuite = suite('works');

testSuite.before(async() => {
  // download the binary if it's not there yet
  const bin = await hugoBin(process.cwd());
  await bin.run(['version']);
});

testSuite('should return path to binary and work', async() => {
  const works = await binCheck(hugoPath, ['version']);
  assert.is(works, true);
});

testSuite.run();
