const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkgConf = require('pkg-conf');
const getBinalyName = require('./getBinalyName');

const hugoVersion = pkgConf.sync('hugoBin').hugoVersion;
const baseUrl = `https://github.com/spf13/hugo/releases/download/v${hugoVersion}/`;

const binalyNames = getBinalyName(hugoVersion, process.platform, process.arch);

module.exports = new BinWrapper()
  .src(`${baseUrl}${binalyNames.comp}`)
  .dest(path.join(__dirname, '../vendor'))
  .use(`${binalyNames.exe}`);
