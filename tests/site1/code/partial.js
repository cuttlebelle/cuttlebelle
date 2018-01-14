import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Partial component for the default layout of partials
 */
const Partial = ({ _body, title, _self }) => (
	<article>
		{ title && <h2>{ title }</h2> }
		<div>{ _body }</div>
		<small>{ _self }</small>
	</article>
);


Partial.propTypes = {
	/**
	 * title: Partial title
	 */
	title: PropTypes.string,

	/**
	 * _body: (partials)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Partial.defaultProps = {};


export default Partial;
