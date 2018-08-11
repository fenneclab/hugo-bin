# hugo-bin [![Build Status](https://img.shields.io/travis/fenneclab/hugo-bin/master.svg)](https://travis-ci.org/fenneclab/hugo-bin) [![dependencies Status](https://img.shields.io/david/fenneclab/hugo-bin.svg)](https://david-dm.org/fenneclab/hugo-bin) [![devDependencies Status](https://img.shields.io/david/dev/fenneclab/hugo-bin.svg)](https://david-dm.org/fenneclab/hugo-bin?type=dev)

> Binary wrapper for [Hugo](https://gohugo.io/)

## Install

```sh
npm install --save-dev hugo-bin
```

hugo-bin now supports [Extended version of Hugo](https://github.com/gohugoio/hugo/releases/tag/v0.43). See [Installation options](#installation-options) for more detail.

## Usage

### API

```js
const execFile = require('child_process').execFile;
const hugo = require('hugo-bin');

execFile(hugo, ['version'], (err, stdout) => {
  console.log(stdout);
});
```

### CLI

```sh
$(npm bin)/hugo --help
npm run create -- 'post/my-new-post' # see below 'npm-run-script'
```

### npm-run-script

```json
{
  "scripts": {
    "build": "hugo",
    "create": "hugo new",
    "serve": "hugo server -ws"
  }
}
```

See the [Hugo Documentation](https://gohugo.io/) for more information.

## Installation options

hugo-bin supports options to change variation of Hugo binaries.

Each options can be configured in the `hugo-bin` section of your `package.json`:

```json
{
  "name": "your-package",
  "version": "0.0.1",
  "hugo-bin": {
    "buildTags": "extended"
  }
}
```

Also as local or global [.npmrc](https://docs.npmjs.com/files/npmrc) configuration file:

```ini
hugo_bin_build_tags = "extended"
```

Also as environment variable:

```sh
export HUGO_BIN_BUILD_TAGS="extended"
```

**Note that you have to run `npm install hugo-bin` to re-install hugo-bin itself, if you change any one of these options.**

### Options

#### buildTags

Default: `""`

Set it to `extended` to download [extended version](https://github.com/gohugoio/hugo/releases/tag/v0.43) binary.

If this set to `extended` but it's not available for the user's platform, then the normal version would be downloaded instead.

## Supported versions

See [the package.json commit history](https://github.com/fenneclab/hugo-bin/commits/master/package.json).

## Full example

- [fenneclab/blog.fenneclab.com](https://github.com/fenneclab/blog.fenneclab.com)

## Super Inspired By

- [mastilver/apex-bin](https://github.com/mastilver/apex-bin)
- [imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin)

## License

MIT © [Shun Sato](http://blog.fenneclab.com/)
