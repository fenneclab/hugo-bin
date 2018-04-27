# hugo-bin [![Build Status](https://travis-ci.org/fenneclab/hugo-bin.svg?branch=master)](https://travis-ci.org/fenneclab/hugo-bin)

> Binary wrapper for [Hugo](https://gohugo.io/)

## Install

```
npm install --save-dev hugo-bin
```

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

## Supported versions

See [the package.json commit histories](https://github.com/fenneclab/hugo-bin/commits/master/package.json).

## Full example

- [fenneclab/blog.fenneclab.com](https://github.com/fenneclab/blog.fenneclab.com)

## Super Inspired By

- [mastilver/apex-bin](https://github.com/mastilver/apex-bin)
- [imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin)

## License

MIT © [Shun Sato](http://blog.fenneclab.com/)
