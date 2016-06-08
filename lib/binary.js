const path = require('path');
const BinWrapper = require('bin-wrapper');
const getBinalyName = require('./getBinalyName');
const pkg = require('../package');

const hugoVersion = pkg.hugoVersion;
const baseUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/`;

const binalyNames = getBinalyName(hugoVersion, process.platform, process.arch);

module.exports = new BinWrapper()
  .src(`${baseUrl}${binalyNames.comp}`)
  .dest(path.join(__dirname, '../vendor'))
  .use(`${binalyNames.exe}`);
