import PropTypes from 'prop-types';
import React from "react";


/**
 * Testing
 *
 * @disable-docs
 */
const Hidden = ( page ) => (
	<div className={`globalheader`}>
		<h1>{ page.title }</h1>
		{ page._body }
	</div>
);


Hidden.propTypes = {
	/**
	 * title: Welcome
	 */
	title: PropTypes.string,

	/**
	 * _body: (text)(7)
	 */
	_body: PropTypes.node.isRequired,
};


Hidden.defaultProps = {};


export default Hidden;
