Cuttlebelle changelog
===========

> The react static site generator that separates editing and code concerns


## Contents

* [Versions](#versions)
* [Release History](#release-history)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Versions

* [v1.0.0-alpha.62 - Updated dependencies, DRY code refactor, added inti test](#v100-alpha62)
* [v1.0.0-alpha.61 - Fixed dependency range in `package.json`](#v100-alpha61)
* [v1.0.0-alpha.60 - Dependency updates](#v100-alpha60)
* [v1.0.0-alpha.*  - Alpha versions for testing](#v100-alpha)

**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History

### v1.0.0-alpha.64

- When quitting the watch an error would occur siting `SIGINT` which is just the signal to exit the program. We skip that "error" now.
- When combining `-w` and `-n` flags the watch would not run. It does now.

### v1.0.0-alpha.63

- Added `getInitialProps` for async data fetching

### v1.0.0-alpha.62

- Updated dependencies, fixed [axios](https://nvd.nist.gov/vuln/detail/CVE-2019-10742) security bug.
	Major changes:
```diff
- "del": "^3.0.0",
+ "del": "^4.1.1",
- "copy-dir": "^0.4.0",
+ "copy-dir": "^1.1.0",
+ "replace-in-file": "^3.4.3",
- "replace-in-file": "^4.1.0",
```
- DRY code refactor for recursive folder lookup
- Added end-to-end test for `init` option

### v1.0.0-alpha.61

- Fixed dependency range in `package.json`
```diff
- "@babel/preset-env": "7.3.4",
+ "@babel/preset-env": "^7.3.4",
```

### v1.0.0-alpha.60

- Dependency updates:
	- `@babel/core` `7.2.2` -> `7.3.4`
	- `@babel/plugin-proposal-object-rest-spread` `7.3.2` -> `7.3.4`
	- `@babel/plugin-transform-runtime` `7.2.0` -> `7.3.4`
	- `@babel/preset-env` `7.3.1` -> `7.3.4
	- `@babel/runtime` `7.3.1` -> `7.3.4`
	- `marked` `0.6.0` -> `0.6.1`
	- `js-yaml` `3.12.1` -> `3.12.2`
	- `prop-types` `15.7.1` -> `15.7.2`
	- `react` `16.8.1` -> `16.8.3`
	- `react-docgen` `3.0.0` -> `4.0.1`
	- `react-dom` `16.8.1` -> `16.8.3`
- Dev dependency updates:
	- `flow-bin` `0.92.1` -> `0.93.0`


### v1.0.0-alpha.*

- 💥 Initial version


**[⬆ back to top](#contents)**


# };
