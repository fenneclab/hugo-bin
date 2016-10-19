const bin = require('./');
const log = require('logalot');

bin.run(['version'], err => {
  if (err) {
    log.error(err.message);
    log.error('Hugo binary installation failed');
    return;
  }
  log.success('Hugo binary is installed successfully');
});
