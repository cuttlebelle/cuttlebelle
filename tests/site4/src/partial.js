import PropTypes from 'prop-types';
import React from "react";


const Partial = ( page ) => (
	<article>
		<h2>{ page.title }</h2>
		<div>{ page._body }</div>
	</article>
);


Partial.propTypes = {
	/**
	 * title: First blog post
	 */
	title: PropTypes.string.isRequired,

	/**
	 * _body: (text)(2)
	 */
	_body: PropTypes.node.isRequired,
};


Partial.defaultProps = {};


export default Partial;
