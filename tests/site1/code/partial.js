import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Partial component for the default layout of partials
 */
const Partial = ({ _body, subtitle, _self }) => (
	<article>
		{ subtitle && <h2>{ subtitle }</h2> }
		<div>{ _body }</div>
		<small>{ _self }</small>
	</article>
);


Partial.propTypes = {
	/**
	 * subtitle: Partial title
	 */
	subtitle: PropTypes.string,

	/**
	 * _body: (partials)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Partial.defaultProps = {};


export default Partial;
