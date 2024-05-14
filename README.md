# hugo-bin [![npm version](https://img.shields.io/npm/v/hugo-bin?logo=npm&logoColor=fff)](https://www.npmjs.com/package/hugo-bin) [![Build Status](https://img.shields.io/github/actions/workflow/status/fenneclab/hugo-bin/ci.yml?branch=main&label=CI&logo=github)](https://github.com/fenneclab/hugo-bin/actions?query=workflow%3ACI+branch%3Amain)

> Binary wrapper for [Hugo](https://github.com/gohugoio/hugo)

- hugo-bin supports the [Extended Hugo version](https://github.com/gohugoio/hugo/releases/tag/v0.43)
- For usage within corporate networks or behind corporate proxies, the download repository can be overwritten

See [Installation options](#installation-options) for more details.

## Install

```sh
npm install hugo-bin --save-dev
```

## Usage

### API

```js
import { execFile } from 'node:child_process';
import hugoPath from 'hugo-bin';

execFile(hugoPath, ['version'], (error, stdout) => {
  if (error) {
    throw error;
  }

  console.log(stdout);
});
```

### CLI

#### Unix

```sh
npm exec hugo help
npm run create -- post/my-new-post.md # see below 'npm run-script'
```

#### Windows

```bat
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

hugo-bin supports options to change the variation of Hugo binaries, to overwrite the download repository and the Hugo version.

Each option can be configured in one of the following ways:

### The `hugo-bin` section of your `package.json`

```json
{
  "name": "your-package",
  "version": "0.0.1",
  "hugo-bin": {
    "buildTags": "extended",
    "downloadRepo": "https://some.example.com/artifactory/github-releases",
    "version": "0.124.1"
  }
}
```

### As local or global [.npmrc](https://docs.npmjs.com/files/npmrc) configuration file

```ini
hugo_bin_build_tags = "extended"
hugo_bin_download_repo = "https://some.example.com/artifactory/github-releases"
hugo_bin_hugo_version = "0.124.1"
```

### As environment variables

On Linux/macOS:

```sh
export HUGO_BIN_BUILD_TAGS="extended"
export HUGO_BIN_DOWNLOAD_REPO="https://some.example.com/artifactory/github-releases"
export HUGO_BIN_HUGO_VERSION="0.124.1"
```

On Windows:

```bat
set HUGO_BIN_BUILD_TAGS=extended
set HUGO_BIN_DOWNLOAD_REPO=https://some.example.com/artifactory/github-releases
set HUGO_BIN_HUGO_VERSION=0.124.1
```

**Note that you have to run `npm install hugo-bin` to re-install hugo-bin itself, if you change any of these options.**

### Options

#### buildTags

- Type: `string`
- Default: `""`

Set `buildTags` to `extended` to download the [extended version](https://github.com/gohugoio/hugo/releases/tag/v0.43) binary.

If this is set to `extended` but it's not available for the user's platform, then the normal version will be downloaded instead.

#### downloadRepo

- Type: `string`
- Default: `"https://github.com"`

Set it to your proxy URL to download the hugo binary from a different download repository.

#### hugoVersion

- Type: `string`
- Default: the version specified in [package.json](package.json)

You can override the Hugo version here. Please note that if any of the URLs have changed upstream, you might not be able to use
any version and you will probably need to update to a newer hugo-bin version which takes into consideration the new URLs.

## Supported Hugo versions

See [the package.json commit history](https://github.com/fenneclab/hugo-bin/commits/main/package.json).

## Super Inspired By

- [mastilver/apex-bin](https://github.com/mastilver/apex-bin)
- [imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin)

## License

[MIT](LICENSE) © Shun Sato
