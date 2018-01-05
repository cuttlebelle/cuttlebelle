import PropTypes from 'prop-types';
import React from 'react';
import SkipLink from '../../scripts/uikit/skip-link.js';

/**
 * The page layout component
 */
const Page = ( page ) => (
	<html>
	<head>
		<title>Guides - { page.pagetitle }</title>
		<meta charSet="utf-8" />
		<meta name="google-site-verification" content="fXPmqCfxWVHNxpSlw6Bm6pmuUcMuTILat3eixX8gbM8" />
		<meta httpEquiv="x-ua-compatible" content="ie=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content={ page.description }/>

		<link rel="stylesheet" href={ `/assets/css/site.css` } />
		{ page.stylesheet != undefined
			? ( <link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } /> )
			: null
		}
		<script src="/assets/js/analytics.js" />
		<script src="/assets/js/no-js.js" />
		<script src="/assets/js/svg4everybody.min.js" />
	</head>
	<body>

		<SkipLink links={[
			{
				link: '#nav',
				text: 'Skip to navigation',
			},
			{
				link: '#content',
				text: 'Skip to content',
			}
		]} />

		<header role="banner" className="uikit-body uikit-grid">
			{ page.header }
		</header>

		<main>
			{ page.main }
		</main>

		{ page.footer }

		<script src="/assets/js/site.js" />
		{ page.script != undefined
			? ( <script rel="stylesheet" href={ `/assets/js/${ page.script }.js` } /> )
			: null
		}
	</body>
	</html>
);


Page.propTypes = {
/**
	 * pagetitle: Homepage
	 */
	pagetitle: PropTypes.string.isRequired,

	/**
	 * description: Lorem ipsum dolor sit amet, consectetur adipiscing elit
	 */
	description: PropTypes.string,

	/**
	 * main: (partials)(5)
	 */
	main: PropTypes.node.isRequired,

	/**
	 * footer: (partials)(2)
	 */
	footer: PropTypes.node.isRequired,

	/**
	 * theme: dark
	 */
	theme: PropTypes.string,

	/**
	 * weight: 20
	 */
	weight: PropTypes.number,

	/**
	 * hidden: false
	 */
	hidden: PropTypes.bool,
};


Page.defaultProps = {};


export default Page;
