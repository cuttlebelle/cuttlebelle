import PropTypes from 'prop-types';
import React from 'react';


/**
 * The page layout component
 */
const Page = ({ title, stylesheet, header, main, footer, script }) => (
	<html>
	<head>
		<title>Cuttlebelle - { title }</title>
		<meta charSet="utf-8" />
		<meta httpEquiv="x-ua-compatible" content="ie=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<link rel="stylesheet" href={ `/assets/css/site.css` } />
		{
			stylesheet != undefined
				? ( <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> )
				: null
		}
	</head>
	<body>
		<div className="top">
			<header role="banner">
				{ header }
			</header>

			<main>
				{ main }
			</main>
		</div>

		<footer>
			{ footer }
		</footer>

		{
			script != undefined
				? ( <script rel="stylesheet" href={ `/assets/js/${ script }.js` } /> )
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
