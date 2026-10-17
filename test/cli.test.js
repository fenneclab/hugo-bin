import { execFile } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
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
import pkg from '../package.json' with { type: 'json' };

const execFileAsync = promisify(execFile);
const cliPath = fileURLToPath(new URL('../bin/cli.js', import.meta.url));
const { hugoVersion: HUGO_VERSION } = pkg;

async function runCli(args, cli = cliPath) {
  try {
    const { stdout, stderr } = await execFileAsync('node', [cli, ...args]);

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

  it('fails with a clear message when the binary is missing', async() => {
    // removing the real vendor/ would break the other test files
    const root = path.join(process.cwd(), 'temp-cli-missing');
    const copy = name => cp(fileURLToPath(new URL(`../${name}`, import.meta.url)), path.join(root, name), { recursive: true });

    try {
      await Promise.all(['bin', 'lib', 'index.js', 'package.json'].map(name => copy(name)));
      const { code, stderr } = await runCli(['version'], path.join(root, 'bin', 'cli.js'));

      expect(code).toBe(1);
      expect(stderr).toContain('Hugo binary not found');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
