import process from 'node:process';
import lib from './lib/index.js';

const hugoBin = await lib(process.cwd());

export default hugoBin.path();
