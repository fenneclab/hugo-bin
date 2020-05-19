# <img src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true" alt="Hugo" width="115"> via NPM [![CI status](https://github.com/jakejarvis/hugo-extended/workflows/Run%20tests/badge.svg)](https://github.com/jakejarvis/hugo-extended/actions) [![npm](https://img.shields.io/npm/v/hugo-extended?color=red)](https://www.npmjs.com/package/hugo-extended) [![Hugo v0.71.0](https://img.shields.io/badge/Hugo-v0.71.0-orange)](https://github.com/gohugoio/hugo) [![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=jakejarvis/hugo-extended)](https://github.com/jakejarvis/hugo-extended/pulls?q=is%3Apr+label%3Adependencies)

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

The following examples simply refer to executing Hugo as a local Node dependency. See the [official Hugo docs](https://gohugo.io/documentation/) for guidance on actual Hugo usage.

### via CLI / `package.json`:

```json
{
  "scripts": {
    "build": "hugo",
    "start": "hugo server --buildDrafts --buildFuture --port 1313"
  }
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
