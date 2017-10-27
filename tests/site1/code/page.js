import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Page component for the default layout of pages
 */
const Page = ( props ) => (
	<html>
	<head>
		<title>{ props.title }</title>

		{
			props.stylesheet
				&& <link rel="stylesheet" href={ props._relativeURL( `/assets/css/${ props.stylesheet }.css`, props._pages[ props._ID ].url ) } />
		}
	</head>
	<body>
		<main>
			<div>{ props.partials }</div>
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
