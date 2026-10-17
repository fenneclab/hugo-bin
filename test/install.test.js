import {
  access,
  cp,
  mkdir,
  rm,
  writeFile
} from 'node:fs/promises';
import { execFile } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const libDir = fileURLToPath(new URL('../lib/', import.meta.url));
const pkgJsonPath = fileURLToPath(new URL('../package.json', import.meta.url));

const SUCCESS_MESSAGE = 'Hugo binary successfully installed!';
const FAILURE_MESSAGE = 'Hugo binary installation failed!';
// nonexistent version, so the download 404s instead of fetching for real
const MISSING_VERSION = '0.0.0-nonexistent';

// install wipes its own vendor dir and the other test files need the real binary
async function copyPackage(root) {
  const pkgDir = path.join(root, 'node_modules', 'hugo-bin');
  await cp(libDir, path.join(pkgDir, 'lib'), { recursive: true });
  await cp(pkgJsonPath, path.join(pkgDir, 'package.json'));
  return pkgDir;
}

async function runInstall(pkgDir, env) {
  try {
    const { stdout, stderr } = await execFileAsync('node', [path.join(pkgDir, 'lib', 'install.js')], {
      cwd: pkgDir,
      env
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

    try {
      const pkgDir = await copyPackage(root);
      const { code, stderr } = await runInstall(pkgDir, {
        ...process.env,
        INIT_CWD: root,
        HUGO_BIN_HUGO_VERSION: MISSING_VERSION
      });

      expect(code).not.toBe(0);
      expect(stderr).toContain(FAILURE_MESSAGE);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('wipes its own vendor dir but not the project one', async() => {
    const root = path.join(process.cwd(), 'temp-install-vendor');
    const projectFile = path.join(root, 'vendor', 'keep.txt');

    try {
      const pkgDir = await copyPackage(root);
      const ownVendor = path.join(pkgDir, 'vendor');
      await mkdir(ownVendor, { recursive: true });
      await mkdir(path.dirname(projectFile), { recursive: true });
      await writeFile(projectFile, '');

      await runInstall(pkgDir, {
        ...process.env,
        INIT_CWD: root,
        HUGO_BIN_HUGO_VERSION: MISSING_VERSION
      });

      expect(await exists(ownVendor)).toBe(false);
      expect(await exists(projectFile)).toBe(true);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  // downloads Hugo for real into the copy
  it('installs successfully', async() => {
    const root = path.join(process.cwd(), 'temp-install-ok');

    try {
      const pkgDir = await copyPackage(root);
      const { code, stdout } = await runInstall(pkgDir, { ...process.env, INIT_CWD: root });

      expect(code).toBe(0);
      expect(stdout).toContain(SUCCESS_MESSAGE);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }, 120_000);
});
