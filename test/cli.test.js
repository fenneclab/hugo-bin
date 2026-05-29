import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import hugoBin from '../lib/index.js';

const execFileAsync = promisify(execFile);
const cliPath = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const pkg = new URL('../package.json', import.meta.url);
const { hugoVersion: HUGO_VERSION } = JSON.parse(await fs.readFile(pkg, 'utf8'));

async function runCli(args) {
  try {
    const { stdout, stderr } = await execFileAsync('node', [cliPath, ...args]);

    return {
      code: 0,
      stdout,
      stderr
    };
  } catch(error) {
    return {
      code: error.code ?? 1,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? ''
    };
  }
}

const testSuite = suite('cli');

testSuite.before(async() => {
  // download the binary if it's not there yet
  const bin = await hugoBin(process.cwd());
  await bin.run(['version']);
});

testSuite('version prints the bundled hugo version', async() => {
  const { code, stdout } = await runCli(['version']);

  assert.is(code, 0);
  assert.ok(stdout.includes(`hugo v${HUGO_VERSION}`), stdout);
});

testSuite('help prints the usage and command list', async() => {
  const { code, stdout } = await runCli(['help']);

  assert.is(code, 0);
  assert.ok(stdout.includes('Usage:'), stdout);
  assert.ok(stdout.includes('Available Commands:'), stdout);
});

testSuite('forwards args and propagates a non-zero exit code', async() => {
  const { code, stderr } = await runCli(['--no-such-flag']);

  assert.is(code, 1);
  assert.ok(stderr.includes('unknown flag: --no-such-flag'), stderr);
});

testSuite.run();
