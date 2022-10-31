import PropTypes from 'prop-types';
import React from 'react';


/**
 * The page layout component
 */
const Page = ( page ) => (
	<html>
	<head>
		<title>{`Cuttlebelle - ${page.title}`}</title>
		<meta charSet="utf-8" />
		<meta httpEquiv="x-ua-compatible" content="ie=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<link rel="stylesheet" href={ `/assets/css/site.css` } />
		{
			page.stylesheet != undefined
				? ( <link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } /> )
				: null
		}
	</head>
	<body>
		<div className="top">
			<header role="banner">
				{ page.header }
			</header>

			<main>
				{ page.main }
				props:
				- _ID: { page._ID }
				- _parents: { JSON.stringify( page._parents ) }
				- _body: { page._body }
				- _pages: { JSON.stringify( page._pages ) }
				- _nav: { JSON.stringify( page._nav ) }
				- _store: { page._storeSet({ test: 'done' }) }{ JSON.stringify( page._store() ) }
				- _relativeURL: { page._relativeURL( page._pages[ page._ID ]._url, '/anotherpage/' ) }
				- _parseMD: { page._parseMD(`# headline\n\n**bold** yay!`) }
			</main>
		</div>

		<footer>
			{ page.footer }
		</footer>

		{
			page.script != undefined
				? ( <script rel="stylesheet" href={ `/assets/js/${ page.script }.js` } /> )
				: null
		}
	</body>
	</html>
);


Page.propTypes = {
/**
	 * title: Homepage
	 */
	title: PropTypes.string.isRequired,

	/**
	 * main: (partials)(5)
	 */
	main: PropTypes.node.isRequired,

	/**
	 * footer: (partials)(2)
	 */
	footer: PropTypes.node.isRequired,
};


Page.defaultProps = {};


export default Page;
