import PropTypes from 'prop-types';
import React from "react";


const Page = ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page.partials }</div>
		</main>
	</body>
	</html>
);

Page.propTypes = {
	/**
	 * title: Welcome
	 */
	title: PropTypes.string.isRequired,

	/**
	 * partials: (partials)(5)
	 */
	partials: PropTypes.node.isRequired,
};


Page.defaultProps = {};


export default Page;
