import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Partial component for the default layout of partials
 */
const Partial = ( props ) => (
	<article>
		{ props.title && <h2>{ props.title }</h2> }
		<div>{ props._body }</div>
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
