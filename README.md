Cuttlebelle
===========

> The react static site generator with editing in mind

[![NPM](https://nodei.co/npm/cuttlebelle.png?downloads=true)](https://nodei.co/npm/cuttlebelle/)

## 💡 Why yet another static site generator?

All static site generators I have used restrict you to use one layout per page. Todays webdesign needs have outgrown this and we often find ourself either
adding code into our content pages (markdown files, liquid templates) or content into our layout pages.
That makes updating and maintaining a page hard, especially for a non-technical content author.

I needed a generator that can **separate content from code** as cleanly as possible while still staying a static site generator.

[React](https://facebook.github.io/react/) comes with the component paradigm and was exactly what I’m looking for.
[JSX](https://facebook.github.io/react/docs/introducing-jsx.html) enables a very easy templating like way to write components while still keeping the power of
javascript. **No more templating languages** that only do half of what you need. Use javascript to write your layouts.


## Contents

* [Install](#install)
* [Usage](#usage)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install

```shell
yarn global add cuttlebelle
```

```shell
npm install cuttlebelle -g
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Usage

* [CLI](#cli)
* [Your content](#your-content)
* [Your assets](#your-assets)
* [Your layout](#your-layout)
* [Customizations](#customizations)


### CLI

![Cuttlebelle cli](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/cuttlebelle.png)

I recommend [installing](#install) Cuttlebelle globally as it exposes the `cuttlebelle` command to your system.

Run it inside the root of your project once installed:

```shell
cd /path/to/my/project
cuttlebelle
```

I suggest to add the below two scripts to your `package.json` file if you opt to install it locally:

```diff
{
	"name": "your name",
	"version": "1.0.0",
	"description": "Your description",
	"main": "index.js",
	"scripts": {
+		"build": "cuttlebelle",
+		"watch": "cuttlebelle -w",
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"devDependencies": {
		"cuttlebelle": "^1.0.0"
	}
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

Then run `yarn build` to run cuttlebelle.

This will generate all pages into the `site` folder _(unless [specified otherwise](#customizations))_.

#### Watch

![Cuttlebelle watch](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/watch.png)

You can also run our highly optimized watch while adding content or developing your layouts.

```
cuttlebelle --watch
```

This command will first build your pages and then watch for changes in any of them. It will dutifully only build the absolute minimum of pages once it detects
a change somewhere. It is so eager to only build those pages that it thinks are relevant that it misses sometimes. In cases where you add content from the
`_sites` prop in one of your layouts for instance. I have added a new and somewhat genius trick to catch cases like that.

**Introducing the _double save_** <sup>TM</sup>

If you feel like the watch may have missed a page and you don’t want to leave your editor to complain about it to the watch, just save your file twice quickly
like a double click. The watch will detect the _double save_<sup>TM</sup> and generate all pages for you again.

#### No generator

Sometimes you may only want to start a watch and not rebuild all pages. For that use the `no-generate` option:

```shell
cuttlebelle --watch --no-generate
```

#### Help

![Cuttlebelle help](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/help.png)

Of course there is also a help option. Just run it with the help flag:

```shell
cuttlebelle --help
```


**[↑ back to Usage](#usage)**


### Your content

The default folder structure divides content into the `content/` folder and the layout and component react files into the `src/` folder.

```shell
.
├── content/           # The content folder
│   ├── page1/         # Each folder represents a page and will be converted to `page1/index.html`
│   │                  # 💡 As long as contains an `index.yml` file.
│   │
│   ├── index/         # The index folder is treated as the homepage and converted to `index.html`
│   │
│   └── page2/         # You can nest pages by nesting them in the folder structure
│       │
│       └── subpage1/  # As long as this folder has an `index.yml` file
│                      # it will be converted to `page2/subpage1/index.html`
│
├── assets/            # The assets folder
└── src/               # The `src` folder is where your layout lives
```

_(_ 💡 _All folders can be configured in your `package.json` file via the [cuttlebelle customizations](#customizations).)_

Now let’s look into one folder:

```shell
.
└── content
    ├── page1
    │   ├── index.yml      # This folder includes an `index.yml` file so it will be converted into a page
    │   ├── partial1.md    # The partials are all in markdown format and can have any name.
    │   └── partial2.md    # They are only converted if they are referenced inside your `index.yml` file
    │
    └── shared             # A folder won’t be generated if it doesn’t have an `index.yml` file
        ├── component1.md  # You can use such folders to share partials between pages
        └── component2.md  # This is just a suggestion. Partials can live anywhere.
```

#### Your `index.yml`

A typical `index.yml` file could look like this:

```yaml
layout: layout/page  # The layout defaults to `layout/page` if it’s not set
title: Homepage      # It’s always a good idea to give your page a title
partials:            # `partials` define the sequence of horizontal building blocks of this page
  - /shared/header   # Not this partial starts with a slash `/`
                     # which means it will be found relative to your `src/` folder
  - feature-image    # Partials starting with just letters are found
  - cta              # relative to the folder the `index.yml` is in
  - contact-cards
  - /shared/footer
```

_(_ 💡 _All variables that are defined inside a page are available as props under `{ _sites }`.)_

#### Your partials

And a typical `partial.md` file could look like this:

```markdown
---                                   # Each markdown file can hav frontmatter
layout: layout/cards                  # The power of cuttlebelle is each partial has it’s own layout
                                      # The layout defaults to layout/partial if it’s undefined
title: partial4                       # You can add any number of variables
cards:                                # Even arrays
  - id: ID1                           # Or objects
    title: Card1
    content: content for first card
  - id: ID2
    title: Card2
    content: content for second card
---

Content
<!-- The content of the markdown file is exposed as { _body } to the props -->
```

_(_ 💡 _Of course all variables are again available as props to the layout by their own name.)_


**[↑ back to Usage](#usage)**


### Your assets

All files included inside the `assets/` folder are moved to `site/assets/`. This is where you should keep your CSS, SVGs and images.
Just create a prop inside your `index.yml` pages to include them into your pages:

`content/index/index.yml`:

```yaml
layout: layout/homepage
title: Homepage
stylesheet: homepage
partials:
  - /shared/header
  - homepage
  - /shared/footer
```

`src/layout/homepage.js`

```jsx
import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>
		<link rel="stylesheet" href={ `/assets/${ page.stylesheet }.css` } />
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page._partials }</div>
		</main>
	</body>
	</html>
);
```

`/assets/homepage.css`

```css
body {
	background:  rebeccapurple;
}
```


**[↑ back to Usage](#usage)**


### Your layout

The layout are all [react](https://facebook.github.io/react/) components. You have to assign a layout to each page and partial. Each component will have a
bunch of props exposed to it.

#### A page layout

A typical component for a page might look like this:

```jsx
import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page._partials }</div>
		</main>
	</body>
	</html>
);
```

A page will receive the following props:

| prop name   | description                                 |
|-------------|---------------------------------------------|
| `_myself`   | The ID of the current page                  |
| `_parents`  | An array of all parent pages IDs            |
| `_sites`    | An object of all pages; with ID as key      |
| `_partials` | The generated HTML of all declared partials |

Plus all other variables declared inside your `index.yml`.

#### A partial layout

A typical component for a partial might look like this:

```jsx
import React from "react";

export default ( page ) => (
	<article>
		<h2>{ page.title }</h2>
		<div>{ page._body }</div>
	</article>
);
```

A page will receive the following props:

| prop name  | description                            |
|------------|----------------------------------------|
| `_myself`  | The ID of the current page             |
| `_parents` | An array of all parent pages IDs       |
| `_sites`   | An object of all pages; with ID as key |
| `_body`    | The body of your markdown file         |

Plus all other variables declared inside your partial.

_(_ 💡 _You can access the page your partial was called in via: `page._sites[ page._myself ]`.)_


**[↑ back to Usage](#usage)**


### Customizations

Cuttlebelle can be customized via your own `package.json` file.

_(_ 💡 _You can generate it via `npm init` if you don’t have `package.json`.)_

See below all configuration with default values:

```diff
{
	"name": "your name",
	"version": "1.0.0",
	"description": "Your description",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
+	"cuttlebelle": {
+		"folder": {
+			"content": "/content/",
+			"src": "/src/",
+			"site": "/site/",
+			"index": "index.yml",
+			"homepage": "index"
+		},
+		"layouts": {
+			"page": "layout/page",
+			"partial": "layout/partial"
+		},
+		"site": {
+			"root": "/",
+			"doctype": "<!DOCTYPE html>",
+			"redirectReact": true
+		}
+	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

A breakdown:

```shell
"cuttlebelle": {                  # The cuttlebelle object
  "folder": {                     # The is where we can adjust folder/file names
    "content": "content/",        # Where does your content live?
    "src": "src/",                # Where do your react layouts live?
    "site": "site/",              # Where do you want to generate your static site to?
    "index": "index.yml",         # What is the name of the file we look for to generate pages?
    "homepage": "index"           # What should the index folder be named?
  },
  "layouts": {                    # Your layout settings
    "page": "layout/page",        # What is the default layout for pages?
    "partial": "layout/partial"   # What is the default layout for partials?
  },
  "site": {                       # General settings
    "root": "/",                  # What should cuttlebelle append to links?
    "doctype": "<!DOCTYPE html>", # What doctype string do you want to add?
    "redirectReact": true         # You can disable redirecting `import` calls to the locally installed
                                  # react instance of cuttlebelle rather than your local folder.
  }
},
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Build

To contribute to this still young project you need to install it’s dependencies and run a watch to transpile th files.

```shell
yarn
yarn watch
```

_(_ 💡 _Please look at the coding style and work with it, not against it :smile:.)_


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

TODO


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History

* v0.1.0 - 💥 Initial version


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## License

Copyright (c) Dominik Wilkowski. Licensed under [GNU-GPLv3](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/LICENSE).


**[⬆ back to top](#contents)**

# };
