import { access, mkdir, rm } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const installPath = fileURLToPath(new URL('../lib/install.js', import.meta.url));

const SUCCESS_MESSAGE = 'Hugo binary successfully installed!';
const FAILURE_MESSAGE = 'Hugo binary installation failed!';
// nonexistent version, so the download 404s instead of fetching for real
const MISSING_VERSION = '0.0.0-nonexistent';

async function runInstall({ cwd, env } = {}) {
  try {
    const { stdout, stderr } = await execFileAsync('node', [installPath], {
      cwd,
      env: env ?? process.env
    });
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

function withoutInitCwd(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.INIT_CWD;
  return env;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

describe('install', () => {
  it('fails with a clear message when the version does not exist', async() => {
    const root = path.join(process.cwd(), 'temp-install-fail');
    await mkdir(root, { recursive: true });

    try {
      const { code, stderr } = await runInstall({
        env: {
          ...process.env,
          INIT_CWD: root,
          HUGO_BIN_HUGO_VERSION: MISSING_VERSION
        }
      });

      expect(code).not.toBe(0);
      expect(stderr).toContain(FAILURE_MESSAGE);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('wipes the vendor dir under the resolved project root', async() => {
    // No INIT_CWD and not under node_modules, so the root falls back to cwd.
    const root = path.join(process.cwd(), 'temp-install-cwd');
    const vendor = path.join(root, 'vendor');
    await mkdir(vendor, { recursive: true });

    try {
      await runInstall({
        cwd: root,
        env: withoutInitCwd({ HUGO_BIN_HUGO_VERSION: MISSING_VERSION })
      });

      expect(await exists(vendor)).toBe(false);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  // throwaway INIT_CWD so install doesn't wipe the real vendor; the binary is already there
  it('installs successfully with INIT_CWD set', async() => {
    const root = path.join(process.cwd(), 'temp-install-initcwd');
    await mkdir(root, { recursive: true });

    try {
      const { code, stdout } = await runInstall({
        env: { ...process.env, INIT_CWD: root }
      });

      expect(code).toBe(0);
      expect(stdout).toContain(SUCCESS_MESSAGE);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
