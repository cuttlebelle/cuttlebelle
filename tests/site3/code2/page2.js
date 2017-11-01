import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Page component for the default layout of pages
 */
const Page = ({
	title,
	stylesheet,
	partials
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{ stylesheet && <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> }
	</head>
	<body>
		<main>
			<h1>{ title }</h1>
			<div>{ partials }</div>
		</main>
	</body>
	</html>
);


Page.propTypes = {
	/**
	 * title: Page title  # if not given, it takes the title from the current page
	 */
	title: PropTypes.string.isRequired,

	/**
	 * stylesheet: style1
	 */
	stylesheet: PropTypes.string,

	/**
	 * partials: (partials)(4)
	 */
	partials: PropTypes.node,
};


Page.defaultProps = {};


export default Page;
