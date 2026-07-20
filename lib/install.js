import { rm } from 'node:fs/promises';
import process from 'node:process';
import hugoBin, { destDir } from './index.js';

async function main() {
  // npm/yarn/pnpm set INIT_CWD to the consumer root on install; fall back to cwd
  // see: https://github.com/npm/npm/issues/16990
  const projectRoot = process.env.INIT_CWD ?? process.cwd();

  await rm(destDir, { force: true, recursive: true });

  try {
    const bin = await hugoBin(projectRoot, { verify: true });
    await bin.run(['version']);
    console.log('Hugo binary successfully installed!');
  } catch(error) {
    console.error('Hugo binary installation failed!');
    // eslint-disable-next-line preserve-caught-error
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}

main();
