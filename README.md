Cuttlebelle
===========

> The react static site generator with editing in mind

[![NPM](https://nodei.co/npm/cuttlebelle.png?downloads=true)](https://nodei.co/npm/cuttlebelle/)
[![Build Status](https://travis-ci.org/dominikwilkowski/cuttlebelle.svg?branch=master)](https://travis-ci.org/dominikwilkowski/cuttlebelle)

![Cuttlebelle files](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/files.gif)

## 🔥 Why yet another static site generator?

All static site generators I have used restrict you to use one layout per page. Todays webdesign needs have outgrown this and we often find ourself either
adding code into our content pages (markdown files, liquid templates) or content into our code.
That makes updating and maintaining a page hard, especially for a non-technical content author.

I needed a generator that can **separate content from code** as cleanly as possible while still staying a static site generator and as dynamic as possible.

[React](https://facebook.github.io/react/) comes with the component paradigm and was exactly what I’m looking for.
[JSX](https://facebook.github.io/react/docs/introducing-jsx.html) enables a very easy templating like way to write components while still keeping the power of
javascript. **No more templating languages** that only do half of what you need. Use javascript to write your layouts.


## Contents

* [Install](#install)
* [Getting started](#getting-started)
* [Usage](#usage)
* [Self-documenting](#self-documenting)
* [Build](#build)
* [Tests](#tests)
* [Release History](#release-history)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Install

```shell
npm install cuttlebelle -g
```

Then run `cuttlebelle` in your working folder.


💡Tip: I recommend [installing](#install) Cuttlebelle globally as it exposes the `cuttlebelle` command to your system.
If you for some reason want to install it locally, consider adding a npm script to your `package.json` to make
running cuttlebelle easier:

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

Then run `npm run build` to run cuttlebelle.


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Getting started

After [installing](#install) cuttlebelle, create a folder called `content` and start populating it.

<table>
	<tbody>
		<tr>
			<th>Your content folder</th>
			<th>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</th>
			<th>Output</th>
		</tr>
		<tr>
			<td>

```shell
.
├── index
│   ├── index.yml
│   ├── partial1.md
│   └── partial2.md
├── page1
│   ├── index.yml
│   └── subpage1
│       ├── index.yml
│       ├── partial1.md
│       └── partial2.md
├── page2
│   ├── index.yml
│   ├── partial1.md
│   └── partial2.md
└── shared
    ├── component1.md
    └── component2.md
```

</td>
<td align="center"> → </td>
<td valign="top">

```shell
.
├── index.html
├── page1
│   ├── index.html
│   └── subpage1
│       └── index.html
└── page2
    └── index.html
```

</tr>
	</tbody>
</table>

Consider this example to see how pages are constructed with partials and layouts:

An **index.yaml** page

<table>
	<tbody>
		<tr>
			<th>index.yml</th>
			<th></th>
			<th>page layout</th>
		</tr>
		<tr>
			<td valign="top">

```yaml
layout: page
title: Homepage
main:
  - header.md
  - body.md
```

</td>
<td align="center"> + </td>
<td valign="top">

```jsx
import React from "react";

export default ( page ) => (
  <html>
  <head>
    <title>{ page.title }</title>
  </head>
  <body>
    <main>
      { page.main }
    </main>
  </body>
  </html>
);
```

</td>
		</tr>
	</tbody>
</table>

A **header.md** partial

<table>
	<tbody>
		<tr>
			<th>partial header.md</th>
			<th></th>
			<th>header layout</th>
		</tr>
		<tr>
			<td valign="top">

```markdown
---
layout: header
headline: First post
sub: Clear content separation
---
```

</td>
<td align="center"> + </td>
<td valign="top">

```jsx
import React from "react";

export default ( page ) => (
  <header>
    <h1 className="header__headline">{ page.headline }</h1>
    {
      page.sub
        && <p className="header__sub">{ page.sub }</p>
    }
  </header>
);
```

</td>
		</tr>
	</tbody>
</table>

A **body.md** partial

<table>
	<tbody>
		<tr>
			<th>partial body.md</th>
			<th></th>
			<th>body layout</th>
		</tr>
		<tr>
			<td valign="top">

```markdown
---
layout: body
headline: First post
---

**Hello world**
```

</td>
<td align="center"> + </td>
<td valign="top">

```jsx
import React from "react";

export default ( page ) => (
  <article>
    <h2>{ page.headline }</h2>
    <div className="body-text">{ page._body }</div>
  </article>
);
```

</td>
		</tr>
	</tbody>
</table>

Will give us this HTML

<table>
	<tbody>
		<tr>
			<th>resulting static HTML file</th>
		</tr>
		<tr>
			<td valign="top">

```html
<!DOCTYPE html>
<html>
<head>
  <title>Homepage</title>
</head>

<body>
  <main>
    <header>
      <h1 class="header__headline">First post</h1>
      <p class="header__sub">Clear content separation</p>
    </header>
    <article>
      <h2>First post</h2>
      <div class="body-text"><strong>Hello world</strong></div>
    </article>
  </main>
</body>

</html>
```

</td>
		</tr>
	</tbody>
</table>


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

```shell
cd /path/to/my/project
cuttlebelle
```

This will generate all pages into the `site` folder _(unless [specified otherwise](#customizations))_.


#### Watch

![Cuttlebelle watch](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/watch.png)

You can also run our highly optimized watch while adding content or developing your layouts.

```
cuttlebelle watch
```

This command will first build your pages and then watch for changes in any of them.

It will dutifully only build the absolute minimum of pages once it detects a change somewhere. It is so eager to only build those pages that it thinks are
relevant that it misses sometimes. In cases where you add content from the `_pages` prop in one of your layouts for instance. I have added a new and somewhat
genius trick to catch cases like that.

**Introducing the _double save_** <sup>TM</sup>

If you feel like the watch may have missed a page and you don’t want to leave your editor to complain about it to the watch, just save your file twice quickly
like a double click. The watch will detect the _double save_<sup>TM</sup> and generate all pages for you again.


💡Tip: You can change the timeout of the watch to detect a double save via the `watchTimeout` [setting](#customizations).


#### No generator

Sometimes you may only want to start a watch and not rebuild all pages. For that use the `no-generate` option:

```shell
cuttlebelle watch --no-generate
```


#### Silent

The watch notifies you each time it encounters an error so you don’t have to watch the watch. You can disable that behavior via the silent option.

```shell
cuttlebelle watch --silent
```


#### Help

![Cuttlebelle help](https://raw.githubusercontent.com/dominikwilkowski/cuttlebelle/master/assets/help.png)

Of course there is also a help option. Just run it with the help flag:

```shell
cuttlebelle help
```


**[↑ back to Usage](#usage)**


### Your content

The default folder structure divides content into the `content/` folder and the layout and component react files into the `code/` folder.

```shell
.
├── content/           # The content folder
│   ├── page1/         # Each folder represents a page and will be converted to `page1/index.html`
│   │                  # 💡 As long as it contains an `index.yml` file.
│   │
│   ├── index/         # The index folder is treated as the homepage and converted to `index.html`
│   │
│   └── page2/         # You can nest pages by nesting them in the folder structure
│       │
│       └── subpage1/  # As long as this folder has an `index.yml` file
│                      # it will be converted to `page2/subpage1/index.html`
│
├── assets/            # The assets folder
└── code/              # The `code` folder is where your layout lives
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
layout: page          # The layout defaults to `page` if it’s not set
title: Homepage       # It’s always a good idea to give your page a title
main:                 # Defining an array in yaml
  - feature-image.md  # This is a partial (because it ends with ".md") and points to a markdown file that exists
  - cta.md
  - contact-cards.md
  - /shared/footer.md # This is also a partial but because it starts with a slash "/" the location where this
                      # partial sits is relative to your content folder and not the page folder you’re in.
header: header.md     # You can define a partial to a variable or to an array as seen above
```

_(_ 💡 _All variables that are defined inside a page are available as props under `{ _pages }` to all partials.)_


#### Your partials

And a typical `partial.md` file could look like this:

```markdown
---                                 # Each markdown file can have frontmatter
layout: cards                       # The power of cuttlebelle is each partial has it’s own layout
                                    # The layout defaults to `partial` if it’s not set
headline: Partial headline          # You can add any number of variables
cards:                              # Even arrays
  - id: ID1                         # Or objects
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
main:
  - /shared/header.md
  - homepage.md
  - /shared/footer.md
aside:
  - nav.md
  - callout.md
```

`code/layout/homepage.js`

```jsx
import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>
		{ page.stylesheet != undefined
			? ( <link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } /> )
			: null
		}
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page.main }</div>
		</main>
		<aside>
			{ page.aside }
		</aside>
	</body>
	</html>
);
```

`/assets/homepage.css`

```css
main {
	background:  rebeccapurple;
}

aside {
	background: hotpink;
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
			<div>{ page.partials }</div>
		</main>
	</body>
	</html>
);
```


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

_(_ 💡 _You can access the page your partial was called in via: `page._pages[ page._ID ]`.)_


#### Props

A file will receive the following props:

| prop name      | description                                                                           | Example                                  |
|----------------|---------------------------------------------------------------------------------------|------------------------------------------|
| `_ID`          | The ID of the current page                                                            | `props._ID`                              |
| `_parents`     | An array of all parent pages IDs                                                      | `props._parents`                         |
| `_body`        | The body of your markdown file (empty for `index.yml` files)                          | `props._body`                            |
| `_pages`       | An object of all pages; with ID as key                                                | `props._pages.map()`                     |
| `_nav`         | A nested object of your site structure                                                | `Object.keys( props._nav ).map()`        |
| `_storeSet`    | You can set data to persist between react components by setting them with this helper | `props._storeSet({ variable: "value" })` |
| `_store`       | To get that data just call this prop function                                         | `props._store`                           |
| `_relativeURL` | A helper function to make an absolute URL relative                                    | `props._relativeURL( URL, yourLocation)` |
| `_parseMD`     | A helper function to parse markdown into HTML                                         | `props._parseMD( props.yourMarkdown )`   |

Plus all other variables declared inside the file either as `frontmatter` or in the `yaml` files.


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
+			"code": "/code/",
+			"site": "/site/",
+			"index": "index",
+			"homepage": "index"
+		},
+		"layouts": {
+			"page": "page",
+			"partial": "partial"
+		},
+		"site": {
+			"root": "/",
+			"doctype": "<!DOCTYPE html>",
+			"redirectReact": true,
+			"markdownRenderer": ""
+		},
+		"docs": {
+			"root": "files/",
+			"index": ".template/docs/layout/index.js",
+			"category": ".template/docs/layout/category.js",
+			"IDProp": "page2",
+			"navProp": {},
+			"pagesProp": {}
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
    "code": "code/",              # Where do your react layouts live?
    "site": "site/",              # Where do you want to generate your static site to?
    "index": "index",             # What is the name of the file we look for to generate pages?
    "homepage": "index"           # What should the index folder be named?
  },
  "layouts": {                    # Your layout settings
    "page": "page",               # What is the default layout for pages?
    "partial": "partial"          # What is the default layout for partials?
  },
  "site": {                       # General settings
    "root": "/",                  # What should cuttlebelle append to links?
    "doctype": "<!DOCTYPE html>", # What doctype string do you want to add?
    "redirectReact": true         # You can disable redirecting `import` calls to the locally installed
                                  # react instance of cuttlebelle rather than your local folder.
    "markdownRenderer": "",       # A path to a file that `module.exports` an Marked.Renderer() object.
                                  # Learn more about it here: https://github.com/chjj/marked#renderer
                                  # The only addition is the `preparse` key that will be run before we go
                                  # into the marked parsing
    "watchTimeout": 400,          # This is the time in milliseconds the watch waits to detect double saves
  }
  "docs": {                                          # Docs settings
    "root": "files/",                                # What is the root folder called where all docs
                                                     # are generated in
    "index": ".template/docs/layout/index.js",       # The path to the index layout file
    "category": ".template/docs/layout/category.js", # The path to the category layout file
                                                     # All following settings are the default props
                                                     # each component is given for the example
    "IDProp": "page2",                               # The _ID prop
    "navProp": {                                     # The _nav prop
      "index": {
        "page1": "page1",
        "page2": {
          "page2/nested": "page2/nested",
        },
        "page3": "page3",
      },
    },
    "pagesProp": {                                   # The _pages prop
      "page1": {
        "url": "/page1",
        "title": "Page 1",
      },
      "page2": {
        "url": "/page2",
        "title": "Page 2",
      },
      "page2/nested": {
        "url": "/page2/nested",
        "title": "Nested in page 2",
      },
      "page3": {
        "url": "/page3",
        "title": "Page 3",
      },
      "index": {
        "url": "/",
        "title": "Homepage",
      },
    },
  },
},
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Self-documenting

Because you now can separate the content flow from the development flow you will still need to communicate what partials and layouts the content authors have
to their disposal and how they might use it.

Cuttlebelle has a built in feature that will generate documentation for your components automatically as long as you use
[PropTypes](https://facebook.github.io/react/docs/typechecking-with-proptypes.html) and a comment above them that reflects the `yaml`.

```jsx
Cards.propTypes = {
  /**
   * level: "2"
   */
  level: PropTypes.oneOf([ '1', '2', '3', '4', '5', '6' ]).isRequired,

  /**
   * hero: true
   */
  hero: PropTypes.bool,

  /**
   * cards:
   *   - title: Card 1
   *     content: Content for card 1
   *     href: http://link/to
   *   - title: Card 2
   *     content: Content for card 2
   *     href: http://link/to
   *   - title: Card 3
   *     content: Content for card 3
   *     href: http://link/to
   *   - title: Card 4
   *     content: Content for card 4
   *     href: http://link/to
   */
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};
```

You can also hide a component from the docs by adding the `@disable-docs` to the main comment before declaring your component:

```jsx
import PropTypes from 'prop-types';
import React from "react";

/**
 * Hiding this component from the docs
 *
 * @disable-docs
 */
const Hidden = ( page ) => (
  <article className={`globalheader`}>
    <h1>{ page.title }</h1>
    { page._body }
  </article>
);

Hidden.propTypes = {
  /**
   * title: Welcome
   */
  title: PropTypes.string.isRequired,

  /**
   * _body: (text)(7)
   */
  _body: PropTypes.node.isRequired,
};

export default Hidden;
```

Once all your components have those comments cuttlebelle can generate the docs for you. All you have to do it run:

```shell
cuttlebelle docs
```

The docs will be generated by default in the `docs/` folder of your project.


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Build

To contribute to this still young project you need to install it’s dependencies and run a watch to transpile the files.

```shell
npm install
npm run watch
```

_(_ 💡 _Please look at the coding style and work with it, not against it :smile:.)_


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

We use [Jest](https://facebook.github.io/jest/) for unit tests.

- `npm run test` to run the tests
- `npm run test:detail` will give you coverage infos
- `npm run test:watch` will spin up the jest watch


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
