import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Page component for the default layout of pages
 */
const Page = ({
	_ID,
	_pages,
	_relativeURL,
	title,
	partials,
	stylesheet
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{
			stylesheet
				&& <link rel="stylesheet" href={ _relativeURL( `/assets/css/${ stylesheet }.css`, _pages[ _ID ]._url ) } />
		}
	</head>
	<body>
		<main>
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
