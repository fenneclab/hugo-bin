import binCheck from 'bin-check';
import { suite } from 'uvu';
// eslint-disable-next-line n/file-extension-in-import
import * as assert from 'uvu/assert';
import hugoPath from '../index.js';

const testSuite = suite('works');

testSuite('should return path to binary and work', async() => {
  const works = await binCheck(hugoPath, ['version']);
  assert.is(works, true);
});

testSuite.run();
