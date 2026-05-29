import { rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import hugoBin from './index.js';

function getProjectRoot() {
  // npm/yarn/pnpm set INIT_CWD to the consumer root on install; fall back to cwd
  // see: https://github.com/npm/npm/issues/16990
  return process.env.INIT_CWD ?? process.cwd();
}

async function main() {
  const projectRoot = getProjectRoot();
  const vendorDir = path.join(projectRoot, './vendor');

  await rm(vendorDir, { force: true, recursive: true });

  const bin = await hugoBin(projectRoot);

  try {
    await bin.run(['version']);
    console.log('Hugo binary successfully installed!');
  } catch(error) {
    console.error('Hugo binary installation failed!');
    // eslint-disable-next-line preserve-caught-error
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

main();
