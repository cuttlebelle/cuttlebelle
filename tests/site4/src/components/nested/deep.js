import PropTypes from 'prop-types';
import React from "react";


const GlobalHeader = ( page ) => (
	<div className={`globalheader`}>
		<h1>{ page.title }</h1>
		{ page._body }
	</div>
);


GlobalHeader.propTypes = {
	/**
	 * title: Welcome
	 */
	title: PropTypes.string,

	/**
	 * _body: (partials)(7)
	 */
	_body: PropTypes.node.isRequired,
};


GlobalHeader.defaultProps = {};


export default GlobalHeader;
