# <img src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true" alt="Hugo" width="115"> via NPM [![CI status](https://github.com/jakejarvis/hugo-extended/workflows/Run%20tests/badge.svg)](https://github.com/jakejarvis/hugo-extended/actions) [![npm](https://img.shields.io/npm/v/hugo-extended?color=red)](https://www.npmjs.com/package/hugo-extended) [![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=jakejarvis/hugo-extended)](https://github.com/jakejarvis/hugo-extended/pulls?q=is%3Apr+label%3Adependencies)

> Plug-and-play binary wrapper for [Hugo Extended](https://gohugo.io/), the awesomest static-site generator.

## Installation

```sh
npm install hugo-extended --save-dev
# or...
yarn add hugo-extended --dev
```

`hugo-extended` defaults to the [extended version](https://gohugo.io/troubleshooting/faq/#i-get-tocss--this-feature-is-not-available-in-your-current-hugo-version) of Hugo on [supported platforms](https://github.com/gohugoio/hugo/releases), and automatically falls back to vanilla Hugo if unsupported (mainly on 32-bit systems).

This package's version numbers align with Hugo's — `hugo-extended@0.64.1` installs Hugo v0.64.1, for example.

## Usage

The following examples simply refer to downloading and executing Hugo as a Node dependency. See the [official Hugo docs](https://gohugo.io/documentation/) for guidance on actual Hugo usage.

### via CLI / `package.json`:

If you'll be using the SCSS features of Hugo Extended, it's probably smart to install [`postcss`](https://www.npmjs.com/package/postcss), [`postcss-cli`](https://www.npmjs.com/package/postcss-cli), and [`autoprefixer`](https://www.npmjs.com/package/autoprefixer) as devDependencies too, since they can be called via [built-in Hugo pipes](https://gohugo.io/hugo-pipes/postcss/).

The `build:preview` script below is designed for [Netlify deploy previews](https://www.netlify.com/blog/2016/07/20/introducing-deploy-previews-in-netlify/), where [`$DEPLOY_PRIME_URL`](https://docs.netlify.com/configure-builds/environment-variables/#deploy-urls-and-metadata) is substituted for the base URL (usually ending in netlify.app) of each commit or pull request.

```jsonc
{
  // ...
  "scripts": {
    "build": "hugo",
    "build:preview": "hugo --baseURL \"${DEPLOY_PRIME_URL:-/}\" --buildDrafts --buildFuture",
    "start": "hugo server"
  },
  "devDependencies": {
    "autoprefixer": "^10.2.5",
    "hugo-extended": "^0.75.1",
    "postcss": "^8.2.9",
    "postcss-cli": "^8.3.1"
  }
  // ...
}
```

```bash
$ npm start

Building sites …

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
Serving pages from memory
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```

### via API:

```js
const { execFile } = require('child_process');
const hugo = require('hugo-extended');

execFile(hugo, ['version'], (error, stdout) => {
  if (error) {
    throw error;
  }

  console.log(stdout);
});
```

## Examples

- [jakejarvis/jarv.is](https://github.com/jakejarvis/jarv.is)

## License

Forked from [fenneclab/hugo-bin](https://github.com/fenneclab/hugo-bin) under the [MIT License](https://github.com/fenneclab/hugo-bin/blob/master/LICENSE), (c) [Shun Sato](http://blog.fenneclab.com/).

Hugo is distributed under the [Apache License 2.0](https://github.com/gohugoio/hugo/blob/master/LICENSE).
