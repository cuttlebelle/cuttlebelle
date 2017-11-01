import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Homepage component for the homepage layout
 */
const Homepage = ({
	title,
	stylesheet,
	header,
	main,
	footer
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{ stylesheet && <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> }
	</head>
	<body>
		{ header }
		<main>
			<div>{ main }</div>
		</main>
		{ footer }
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
