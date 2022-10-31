Cuttlebelle changelog
===========

> The react static site generator that separates editing and code concerns


## Contents

* [Versions](#versions)
* [Release History](#release-history)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Versions

* [v1.0.0-alpha.79 - Updated dependencies](#v100-alpha79)
* [v1.0.0-alpha.78 - Added react v18](#v100-alpha78)
* [v1.0.0-alpha.77 - Updated dependencies](#v100-alpha77)
* [v1.0.0-alpha.76 - Updated dependencies](#v100-alpha76)
* [v1.0.0-alpha.75 - Updated dependencies](#v100-alpha75)
* [v1.0.0-alpha.74 - Dropped support for node v10, updated dependencies](#v100-alpha74)
* [v1.0.0-alpha.73 - Updated dependencies](#v100-alpha73)
* [v1.0.0-alpha.72 - Updated dependencies](#v100-alpha72)
* [v1.0.0-alpha.71 - Updated dependencies](#v100-alpha71)
* [v1.0.0-alpha.70 - Updated dependencies](#v100-alpha70)
* [v1.0.0-alpha.69 - Disabled Windows support, Deprecated node 8, Updated dependencies](#v100-alpha69)
* [v1.0.0-alpha.68 - Updated dependencies](#v100-alpha68)
* [v1.0.0-alpha.67 - Updated dependencies](#v100-alpha67)
* [v1.0.0-alpha.66 - Fixed error output in cli output](#v100-alpha66)
* [v1.0.0-alpha.65 - Some fixes to docs](#v100-alpha65)
* [v1.0.0-alpha.64 - Fixed `-w -n` flag](#v100-alpha64)
* [v1.0.0-alpha.63 - Added `getInitialProps` for async data fetching](#v100-alpha63)
* [v1.0.0-alpha.62 - Updated dependencies, DRY code refactor, added inti test](#v100-alpha62)
* [v1.0.0-alpha.61 - Fixed dependency range in `package.json`](#v100-alpha61)
* [v1.0.0-alpha.60 - Dependency updates](#v100-alpha60)
* [v1.0.0-alpha.*  - Alpha versions for testing](#v100-alpha)

**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History

### v1.0.0-alpha.79

- Added `@babel/plugin-transform-arrow-functions` as dependency for babel
- Updated dependencies

### v1.0.0-alpha.78

- Added support for react 18
- Updated dependencies
	Major changes:
```diff
- "react": "^17",
+ "react": "^18",
- "react-dom": "^17",
+ "react-dom": "^18",
```

### v1.0.0-alpha.77

- Updated dependencies
	Major changes:
```diff
- "marked": "^3.0.4",
+ "marked": "^4.0.4",
```

### v1.0.0-alpha.76

- Updated dependencies, fixed [set-value](https://github.com/advisories/GHSA-4jqc-8m5r-9rpr) security bugs.
	Major changes:
```diff
- "marked": "^2.1.2",
+ "marked": "^3.0.4",
```

### v1.0.0-alpha.75

- Updated dependencies, fixed [ws](https://github.com/advisories/GHSA-6fc8-4gx4-v693) security bugs.
	Major changes:
```diff
- "node-notifier": "^9.0.1",
+ "node-notifier": "^10.0.0",
```

### v1.0.0-alpha.74

- Dropped support for node v10
- Updated dependencies, fixed [xmlhttprequest-ssl](https://github.com/advisories/GHSA-h4j5-c7cj-74xg) security bugs.
	Major changes:
```diff
- "fs-extra": "^9.1.0",
+ "fs-extra": "^10.0.0",
```

### v1.0.0-alpha.73

- Updated dependencies, fixed [marked](https://github.com/advisories/GHSA-4r62-v4vq-hr96), [socket.io](https://github.com/advisories/GHSA-fxwf-4rqh-v8g3)
	and [axios](https://github.com/advisories/GHSA-4w2v-q235-vp99) security bugs.
	Major changes:
```diff
- "js-yaml": "^3.14.1",
+ "marked": "^1.2.7",
- "js-yaml": "^4.0.0",
+ "marked": "^2.0.0",
```

### v1.0.0-alpha.72

- Updated dependencies, fixed [node-notifier](https://github.com/advisories/GHSA-5fw9-fq32-wv5p) security bug.
	Major changes:
```diff
- "node-notifier": "^8.0.0",
+ "node-notifier": "^9.0.0",
```

### v1.0.0-alpha.71

- Disabled flow test
- Updated dependencies, fixed [object-path](https://github.com/advisories/GHSA-cwx2-736x-mf6w) security bug.
	Major changes:
```diff
- "del": "^5.1.0",
+ "del": "^6.0.0",
- "node-notifier": "^7.0.1",
+ "node-notifier": "^8.0.0",
- "react": "^16.13.1",
+ "react": "^17.0.1",
- "react-dom": "^16.13.1",
+ "react-dom": "^17.0.1",
```
	Minor changes:
```diff
- "@babel/core": "^7.10.5",
+ "@babel/core": "^7.12.3",
- "@babel/plugin-proposal-object-rest-spread": "^7.10.4",
+ "@babel/plugin-proposal-object-rest-spread": "^7.12.1",
- "@babel/plugin-transform-runtime": "^7.10.5",
+ "@babel/plugin-transform-runtime": "^7.12.1",
- "@babel/preset-env": "^7.10.4",
+ "@babel/preset-env": "^7.12.1",
- "@babel/preset-react": "^7.10.4",
+ "@babel/preset-react": "^7.12.1",
- "@babel/register": "^7.10.5",
+ "@babel/register": "^7.12.1",
- "@babel/runtime": "^7.10.5",
+ "@babel/runtime": "^7.12.1",
- "browser-sync": "^2.26.9",
+ "browser-sync": "^2.26.13",
- "marked": "^1.1.1",
+ "marked": "^1.2.2",
- "react-docgen": "^5.3.0",
+ "react-docgen": "^5.3.1",
- "slugify": "^1.4.4",
+ "slugify": "^1.4.5",
```

### v1.0.0-alpha.70

- Disabled `mangle` email links by default (https://marked.js.org/#/USING_ADVANCED.md#options)
- Updated dependencies, fixed [lodash](https://github.com/advisories/GHSA-p6mc-m468-83gw) security bug.
	Major changes:
```diff
- "fs-extra": "^8.1.0",
+ "fs-extra": "^9.0.1",
- "marked": "^0.8.0",
+ "marked": "^1.1.1",
- "node-notifier": "^6.0.0",
+ "node-notifier": "^7.0.1",
```
	Minor changes:
```diff
- "@babel/core": "^7.8.7",
+ "@babel/core": "^7.10.5",
- "@babel/plugin-proposal-object-rest-spread": "^7.8.3",
+ "@babel/plugin-proposal-object-rest-spread": "^7.10.4",
- "@babel/plugin-transform-runtime": "^7.8.3",
+ "@babel/plugin-transform-runtime": "^7.10.5",
- "@babel/preset-env": "^7.8.7",
+ "@babel/preset-env": "^7.10.4",
- "@babel/preset-react": "^7.8.3",
+ "@babel/preset-react": "^7.10.4",
- "@babel/register": "^7.8.6",
+ "@babel/register": "^7.10.5",
- "@babel/runtime": "^7.8.7",
+ "@babel/runtime": "^7.10.5",
- "browser-sync": "^2.26.7",
+ "browser-sync": "^2.26.9",
- "js-yaml": "^3.13.1",
+ "js-yaml": "^3.14.0",
- "react": "^16.13.0",
+ "react": "^16.13.1",
- "react-dom": "^16.13.0",
+ "react-dom": "^16.13.1",
- "slugify": "^1.4.0",
+ "slugify": "^1.4.4",
```

### v1.0.0-alpha.69

- Disabled Windows support as it's too hard to maintain
- Deprecated support for node 8
- Updated dependencies, fixed [acorn](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-7598) security bug.
	Minor changes:
```diff
- "@babel/core": "^7.7.7",
+ "@babel/core": "^7.8.7",
- "@babel/plugin-proposal-object-rest-spread": "^7.7.7",
+ "@babel/plugin-proposal-object-rest-spread": "^7.8.3",
- "@babel/plugin-syntax-dynamic-import": "^7.7.4",
+ "@babel/plugin-syntax-dynamic-import": "^7.8.3",
- "@babel/plugin-transform-runtime": "^7.7.6",
+ "@babel/plugin-transform-runtime": "^7.8.3",
- "@babel/preset-env": "^7.7.7",
+ "@babel/preset-env": "^7.8.7",
- "@babel/preset-react": "^7.7.4",
+ "@babel/preset-react": "^7.8.3",
- "@babel/register": "^7.7.7",
+ "@babel/register": "^7.8.6",
- "@babel/runtime": "^7.7.7",
+ "@babel/runtime": "^7.8.7",
- "react": "^16.12.0",
+ "react": "^16.13.0",
- "react-docgen": "^5.0.0",
+ "react-docgen": "^5.3.0",
- "react-dom": "^16.12.0",
+ "react-dom": "^16.13.0",
- "slugify": "^1.3.6",
+ "slugify": "^1.4.0",
```

### v1.0.0-alpha.68

- Updated dependencies, fixed [handlebars](https://github.com/advisories/GHSA-w457-6q6x-cgp9) security bug.
	Major changes:
```diff
- "marked": "^0.7.0",
+ "marked": "^0.8.0",
- "node-notifier": "^5.4.0",
+ "node-notifier": "^6.0.0",
- "react-docgen": "^4.1.1",
+ "react-docgen": "^5.0.0",
```

### v1.0.0-alpha.67

- Updated dependencies, fixed [lodash](https://github.com/lodash/lodash/pull/4336) security bug.
	Major changes:
```diff
- "marked": "^0.6.3",
+ "marked": "^0.7.0",
```

### v1.0.0-alpha.66

- Fixed `TypeError: input.replace is not a function` error in cli output

### v1.0.0-alpha.65

- Fixed how errors are reported when docs failed to generate an example yaml
- Fixed some CSS for docs
- Updated dependencies, fixed [axios](https://nvd.nist.gov/vuln/detail/CVE-2019-10742) security bug again...
	Major changes:
```diff
- "del": "^4.1.1",
+ "del": "^5.0.0",
- "fs-extra": "^7.0.1",
+ "fs-extra": "^8.1.0",
```
- Deprecated support for Node 6

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
