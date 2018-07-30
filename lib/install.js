const bin = require('./');
const log = require('logalot');

bin.run(['version'])
.then(() => {
  log.success('Hugo binary is installed successfully');
})
.catch(err => {
  log.error(err.message);
  log.error('Hugo binary installation failed');
});
