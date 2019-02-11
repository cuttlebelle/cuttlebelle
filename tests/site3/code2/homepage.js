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
	footer,
	_globalProp
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{ stylesheet && <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> }
	</head>
	<body>
		{ header }
		<main>
			<h2>_globalProp</h2>
			<dl>
				<dt>_globalProp.foo:</dt>
				<dd>{ _globalProp.foo }</dd>
				<dt>_globalProp.enabled:</dt>
				<dd>{ _globalProp.enabled ? 'enabled' : 'disabled' }</dd>
				<dt>_globalProp.howmuch:</dt>
				<dd>{ _globalProp.howmuch }</dd>
			</dl>
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
