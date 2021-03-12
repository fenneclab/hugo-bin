'use strict';

const bin = require('.');

(async () => {
  try {
    await bin.run(['version']);
    console.log('✔ Hugo installed successfully!');
  } catch (error) {
    console.error('✖ ERROR: Hugo installation failed. :( Are you sure this platform is supported?\n', error);
  }
})();
