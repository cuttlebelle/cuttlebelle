import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Homepage component for the homepage layout
 */
const Homepage = ( props ) => (
	<html>
	<head>
		<title>{ props.title }</title>

		{ props.stylesheet && <link rel="stylesheet" href={ `/assets/css/${ props.stylesheet }.css` } /> }
	</head>
	<body>
		{ props.header }
		<main>
			<div>{ props.main }</div>
		</main>
		{ props.footer }
	</body>
	</html>
);


Homepage.propTypes = {
	/**
	 * stylesheet: style1
	 */
	stylesheet: PropTypes.string.isRequired,

	/**
	 * header: (partials)(4)
	 */
	header: PropTypes.node,

	/**
	 * main: (partials)(4)
	 */
	main: PropTypes.node.isRequired,

	/**
	 * footer: (partials)(4)
	 */
	footer: PropTypes.node,
};


Homepage.defaultProps = {};


export default Homepage;
