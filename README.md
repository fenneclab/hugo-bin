# hugo-extended via NPM [![CI status](https://github.com/jakejarvis/hugo-node/workflows/Test/badge.svg)](.github/workflows) [![npm](https://img.shields.io/npm/v/hugo-extended)](https://www.npmjs.com/package/hugo-extended) [![Hugo v0.63.2](https://img.shields.io/badge/Hugo-v0.63.2-orange)](https://github.com/gohugoio/hugo) [![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=jakejarvis/hugo-node)](https://github.com/jakejarvis/hugo-node/pulls?q=is%3Apr+label%3Adependencies)

> Plug-and-play binary wrapper for [Hugo Extended](https://gohugo.io/), the awesomest static-site generator.

## Install

```sh
npm install hugo-extended --save-dev
# or...
yarn add hugo-extended --dev
```

`hugo-extended` defaults to the [extended version](https://gohugo.io/getting-started/installing/#linux) of Hugo on [supported platforms](https://github.com/gohugoio/hugo/releases), and falls back to vanilla Hugo automatically if unsupported.

## Usage

### API

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

### package.json

```json
{
  "scripts": {
    "build": "hugo",
    "start": "hugo serve",
    "create": "hugo new"
  }
}
```

#### CLI

```sh
$(npm bin)/hugo --help
npm run create -- post/my-new-post.md
```

or on Windows:

```bat
for /f "delims=" %F in ('npm bin') do call "%F\hugo" help
npm run create -- post/my-new-post.md
```

See the [Hugo Documentation](https://gohugo.io/documentation/) for additional functionality.

## Examples

- [jakejarvis/jarv.is](https://github.com/jakejarvis/jarv.is)

## License

Forked from [fenneclab/hugo-bin](https://github.com/fenneclab/hugo-bin) under the [MIT License](https://github.com/fenneclab/hugo-bin/blob/master/LICENSE), (c) [Shun Sato](http://blog.fenneclab.com/).

Hugo is distributed under the [Apache License 2.0](https://github.com/gohugoio/hugo/blob/master/LICENSE).
