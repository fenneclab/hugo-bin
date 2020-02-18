'use strict';

const bin = require('.');

bin.run(['version']).then(() => {
  console.log('✔ Hugo installed successfully!');
}).catch(error => {
  console.error('✖ ERROR: Hugo installation failed. :(\n', error);
});
