const path = require('path');
const bin = require('./');
const log = require('logalot');

function getProjectRoot() {
  // projectRoot on postinstall could be INIT_CWD introduced in npm>=5.4
  // see: https://github.com/npm/npm/issues/16990
  const initCwd = process.env.INIT_CWD;
  if (initCwd) {
    return initCwd;
  }
  // Fallback of getting INIT_CWD
  const cwd = process.cwd();
  const paths = cwd.split(path.sep);
  // If process.cwd end with 'node_modules/*' then get the dependent root directory,
  // otherwise returns cwd (ordinary it will be the postinstall process of hugo-bin itself).
  if (paths.length > 1 && paths[paths.length - 2] === 'node_modules') {
    return path.resolve('../../', cwd);
  }
  return cwd;
}

bin(getProjectRoot()).run(['version'])
.then(() => {
  log.success('Hugo binary is installed successfully');
})
.catch(err => {
  log.error(err.message);
  log.error('Hugo binary installation failed');
});
