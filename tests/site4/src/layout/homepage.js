import PropTypes from 'prop-types';
import React from "react";


const Homepage = ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>

		<link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } />
	</head>
	<body>
		<header>
			<strong>{ page.header.title }</strong>
			{ page.header.intro && <p>{ page.header.intro }</p> }
		</header>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page.partials }</div>
		</main>
	</body>
	</html>
);


Homepage.propTypes = {
	title: PropTypes.string.isRequired,

	/**
	 * @example [partials](3)
	 */
	partials: PropTypes.node.isRequired,

	/**
	 * An object for the header
	 */
	header: PropTypes.shape({
		title: PropTypes.string.isRequired,
		intro: PropTypes.string,
	}).isRequired,
};


Homepage.defaultProps = {};


export default Homepage;
