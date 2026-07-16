import semver from 'semver';
import pkg from '../package.json' with { type: 'json' };

console.log(semver.prerelease(pkg.version) ? 'next' : 'latest');
