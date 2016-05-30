const path = require('path');
const BinWrapper = require('bin-wrapper');

const getBinalyName = require('./getBinalyName');

const HUGO_VERSION = '0.15';
const baseUrl = `https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/`;
const binalyNames = getBinalyName(HUGO_VERSION);

module.exports = new BinWrapper()
  .src(`${baseUrl}${binalyNames.binaryName}${binalyNames.comp}`)
  .dest(path.join(__dirname, '../vendor'))
  .use(`${binalyNames.binaryName}${binalyNames.exe}`);
