import process from 'node:process';
import hugoBin from './lib/index.js';

const bin = await hugoBin(process.cwd());
const hugoPath = bin.path();

export default hugoPath;
