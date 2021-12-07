import process from 'node:process';
import lib from './lib/index.js';

export default lib(process.cwd()).path();
