/* eslint-env node, mocha */

'use strict';

const { execFile } = require('child_process');
const assert = require('assert');
const hugo = require('..');

it('Hugo exists and runs?', async () => {
  assert(execFile(hugo, ['env'], (error, stdout) => {
    if (error) throw error;
    console.log(stdout);
  }));
});
