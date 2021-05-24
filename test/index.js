/* eslint-env node, mocha */

'use strict';

const assert = require('assert');
const binCheck = require('bin-check');
const hugoBin = require('..');

it('Hugo exists and runs?', async () => {
  assert(await binCheck(hugoBin, ['version']));
});
