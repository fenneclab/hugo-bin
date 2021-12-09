import path from 'node:path';
import process from 'node:process';
import picocolors from 'picocolors';
import bin from './index.js';

function getProjectRoot() {
  // `projectRoot` on postinstall could be INIT_CWD introduced in npm >= 5.4
  // see: https://github.com/npm/npm/issues/16990
  const initCwd = process.env.INIT_CWD;
  if (initCwd) {
    return initCwd;
  }

  // Fallback of getting INIT_CWD
  const cwd = process.cwd();
  const paths = cwd.split(path.sep);
  // If `process.cwd` ends with 'node_modules/*' then get the dependent root directory,
  // otherwise return the `cwd` (ordinary it will be the postinstall process of hugo-bin itself).
  if (paths.length > 1 && paths[paths.length - 2] === 'node_modules') {
    return path.resolve('../../', cwd);
  }

  return cwd;
}

bin(getProjectRoot()).run(['version'])
  .then(() => {
    console.log(picocolors.green('Hugo binary successfully installed!'));
  })
  .catch(error => {
    console.error(picocolors.red(`${error.message}\nHugo binary installation failed!`));
  });
