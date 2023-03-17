# hugo-bin [![npm version](https://img.shields.io/npm/v/hugo-bin.svg)](https://www.npmjs.com/package/hugo-bin) [![Build Status](https://img.shields.io/github/actions/workflow/status/fenneclab/hugo-bin/ci.yml?branch=main&label=CI&logo=github)](https://github.com/fenneclab/hugo-bin/actions?query=workflow%3ACI+branch%3Amain)

> Binary wrapper for [Hugo](https://gohugo.io/)

## Install

```sh
npm install hugo-bin --save-dev
```

hugo-bin supports the [Extended Hugo version](https://github.com/gohugoio/hugo/releases/tag/v0.43). See [Installation options](#installation-options) for more details.

For usage within corporate networks or behind corporate proxies, the download repository can be overwritten, see [Installation options](#installation-options) for more details.

## Usage

### API

```js
import { execFile } from 'node:child_process';
import hugo from 'hugo-bin';

execFile(hugo, ['version'], (error, stdout) => {
  if (error) {
    throw error;
  }

  console.log(stdout);
});
```

### CLI

```sh
# older npm
$(npm bin)/hugo --help
# newer npm
npm exec hugo help
npm run create -- post/my-new-post.md # see below 'npm run-script'
```

or on Windows:

```bat
rem older npm
for /f "delims=" %F in ('npm bin') do call "%F\hugo" help
rem newer npm
npm exec hugo help
rem see below 'npm run-script'
npm run create -- post/my-new-post.md
```

### npm run-script

```json
{
  "scripts": {
    "build": "hugo",
    "create": "hugo new",
    "serve": "hugo server"
  }
}
```

See the [Hugo Documentation](https://gohugo.io/) for more information.

## Installation options

hugo-bin supports options to change the variation of Hugo binaries and to overwrite the download repository.

Each option can be configured in the `hugo-bin` section of your `package.json`:

```json
{
  "name": "your-package",
  "version": "0.0.1",
  "hugo-bin": {
    "buildTags": "extended",
    "downloadRepo" : "https://some.example.com/artifactory/github-releases"
  }
}
```

Also as local or global [.npmrc](https://docs.npmjs.com/files/npmrc) configuration file:

```ini
hugo_bin_build_tags = "extended"
hugo_bin_download_repo = "https://some.example.com/artifactory/github-releases"
```

Also as an environment variable:

```sh
export HUGO_BIN_BUILD_TAGS="extended"
export HUGO_BIN_DOWNLOAD_REPO="https://some.example.com/artifactory/github-releases"
```

**Note that you have to run `npm install hugo-bin` to re-install hugo-bin itself, if you change any of these options.**

### Options

#### buildTags

Default: `""`

Set it to `extended` to download the [extended version](https://github.com/gohugoio/hugo/releases/tag/v0.43) binary.

If this is set to `extended` but it's not available for the user's platform, then the normal version will be downloaded instead.

#### downloadRepo

Default: `"https://github.com"`

Set it to your corporate proxy url to download the hugo binary from a different download repository.

## Supported versions

See [the package.json commit history](https://github.com/fenneclab/hugo-bin/commits/main/package.json).

## Super Inspired By

- [mastilver/apex-bin](https://github.com/mastilver/apex-bin)
- [imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin)

## License

MIT © Shun Sato
