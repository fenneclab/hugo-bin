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

|  hugo-bin version | Hugo version |
|:-----------------:|:------------:|
|       ^0.16.0     |     v0.29    |
|       ^0.15.0     |     v0.28    |
|       ^0.14.0     |     v0.27.1  |
|       ^0.13.0     |     v0.26    |
|       ^0.12.0     |     v0.25.1  |
|       ^0.11.0     |     v0.24.1  |
|       ^0.10.0     |     v0.23    |
|       ^0.9.0      |     v0.22.1  |
|       ^0.8.0      |     v0.21    |
|       ^0.7.0      |     v0.20.7  |
|       ^0.6.0      |     v0.19    |
|       ^0.5.0      |     v0.18.1  |
|       ^0.4.0      |     v0.17    |
|       ^0.3.0      |     v0.16    |

## Full example

- [fenneclab/blog.fenneclab.com](https://github.com/fenneclab/blog.fenneclab.com)

## Super Inspired By

- [mastilver/apex-bin](https://github.com/mastilver/apex-bin)
- [imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin)

## License

MIT © [Shun Sato](http://blog.fenneclab.com/)
