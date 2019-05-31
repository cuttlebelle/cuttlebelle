import PropTypes from 'prop-types';
import React from 'react';


/**
 * The page layout component
 */
const Page = ({ title, stylesheet, header, main, footer, script, _relativeURL, _ID, _pages }) => (
	<html>
	<head>
		<title>Cuttlebelle - { title }</title>
		<meta charSet="utf-8" />
		<meta httpEquiv="x-ua-compatible" content="ie=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<link rel="stylesheet" href={ _relativeURL( `/assets/css/site.css`, _ID ) } />
		{
			stylesheet != undefined
				? ( <link rel="stylesheet" href={ _relativeURL( `/assets/css/${ stylesheet }.css`, _ID ) } /> )
				: null
		}
	</head>
	<body>
		<div className="top">
			<header role="banner">
				{ header }
			</header>

			<main>
				thing: { _pages[ _ID].thing }
				<hr/>
				{ main }
				<hr/>
				thing: { _pages[ _ID].thing }
				<hr/>
				<pre>
					_pages: {
						JSON.stringify( _pages, null, 2 )
					}
				</pre>
				<pre>
					main: {
						JSON.stringify( main, null, 2 )
					}
				</pre>
			</main>
		</div>

		<footer>
			{ footer }
		</footer>

		{
			script != undefined
				? ( <script src={ _relativeURL( `/assets/js/${ script }.js`, _ID ) } /> )
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
