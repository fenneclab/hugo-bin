import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import {
  beforeAll,
  describe,
  expect,
  it
} from 'vitest';
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

describe('cli', () => {
  beforeAll(async() => {
    // download the binary if it's not there yet
    const bin = await hugoBin(process.cwd());
    await bin.run(['version']);
  });

  it('version prints the bundled hugo version', async() => {
    const { code, stdout } = await runCli(['version']);

    expect(code).toBe(0);
    expect(stdout).toContain(`hugo v${HUGO_VERSION}`);
  });

  it('help prints the usage and command list', async() => {
    const { code, stdout } = await runCli(['help']);

    expect(code).toBe(0);
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('Available Commands:');
  });

  it('forwards args and propagates a non-zero exit code', async() => {
    const { code, stderr } = await runCli(['--no-such-flag']);

    expect(code).toBe(1);
    expect(stderr).toContain('unknown flag: --no-such-flag');
  });
});
