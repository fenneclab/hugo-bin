'use strict';

const path = require('path');
const signale = require('signale');
const bin = require('.');

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
    signale.success('Hugo binary installed successfully!');
  })
  .catch(error => {
    signale.fatal(`${error.message}\nHugo binary installation failed!`);
  });
