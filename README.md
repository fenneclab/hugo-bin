# <img src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true" alt="Hugo" width="115"> via NPM [![npm](https://img.shields.io/npm/v/hugo-extended?color=blue&logo=npm)](https://www.npmjs.com/package/hugo-extended) [![CI status](https://github.com/jakejarvis/hugo-extended/workflows/Run%20tests/badge.svg)](https://github.com/jakejarvis/hugo-extended/actions)

> Plug-and-play binary wrapper for [Hugo Extended](https://gohugo.io/), the awesomest static-site generator.

## Installation

```sh
npm install hugo-extended --save-dev
# or...
yarn add hugo-extended --dev
```

`hugo-extended` defaults to the [extended version](https://gohugo.io/troubleshooting/faq/#i-get--this-feature-is-not-available-in-your-current-hugo-version) of Hugo on [supported platforms](https://github.com/gohugoio/hugo/releases), and automatically falls back to vanilla Hugo if unsupported (mainly on 32-bit systems).

This package's version numbers align with Hugo's — `hugo-extended@0.64.1` installs Hugo v0.64.1, for example.

_Note:_ If you'll be using the SCSS features of Hugo Extended, it's probably smart to install [`postcss`](https://www.npmjs.com/package/postcss), [`postcss-cli`](https://www.npmjs.com/package/postcss-cli), and [`autoprefixer`](https://www.npmjs.com/package/autoprefixer) as devDependencies too, since they can be conveniently called via [built-in Hugo pipes](https://gohugo.io/hugo-pipes/postcss/):

```sh
npm install postcss postcss-cli autoprefixer --save-dev
# or...
yarn add postcss postcss-cli autoprefixer --dev
```

## Usage

The following examples simply refer to downloading and executing Hugo as a Node dependency. See the [official Hugo docs](https://gohugo.io/documentation/) for guidance on actual Hugo usage.

### via CLI / `package.json`:

The `build:preview` script below is designed for [Netlify deploy previews](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/), where [`$DEPLOY_PRIME_URL`](https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata) is substituted for the base URL (usually ending in .netlify.app) of each pull request, branch, or commit preview.

```jsonc
// package.json:

{
  // ...
  "scripts": {
    "build": "hugo",
    "build:preview": "hugo --baseURL \"${DEPLOY_PRIME_URL:-/}\" --buildDrafts --buildFuture",
    "start": "hugo server"
  },
  "devDependencies": {
    "autoprefixer": "^10.3.4",
    "hugo-extended": "^0.88.1",
    "postcss": "^8.3.6",
    "postcss-cli": "^8.3.1"
  }
  // ...
}
```

```bash
$ npm run start

Start building sites …
hugo v0.88.1-5BC54738+extended darwin/amd64 BuildDate=2021-09-04T09:39:19Z VendorInfo=gohugoio

                   | EN
-------------------+------
  Pages            |  50
  Paginator pages  |   0
  Non-page files   | 138
  Static files     |  39
  Processed images |  63
  Aliases          |   0
  Sitemaps         |   1
  Cleaned          |   0

Built in 2361 ms
Watching for changes in {archetypes,assets,content,data,layouts,package.json,static}
Watching for config changes in config.toml
Environment: "development"
Serving pages from memory
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

### via API:

```js
// version.js:

import hugo from "hugo-extended";
import { execFile } from "child_process";

(async () => {
  const binPath = await hugo();

  execFile(binPath, ["version"], (error, stdout) => {
    console.log(stdout);
  });
})();
```

```bash
$ node version.js
hugo v0.88.1-5BC54738+extended darwin/amd64 BuildDate=2021-09-04T09:39:19Z VendorInfo=gohugoio
```

## Examples

- [jakejarvis/jarv.is](https://github.com/jakejarvis/jarv.is)

## License

This project is distributed under the [MIT License](LICENSE.md). Hugo is distributed under the [Apache License 2.0](https://github.com/gohugoio/hugo/blob/master/LICENSE).
