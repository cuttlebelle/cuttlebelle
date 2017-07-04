import PropTypes from 'prop-types';
import React from "react";


const headerClasses = {
	light: 'globalheader--light',
	dark: 'globalheader--dark',
	white: 'globalheader--white',
	blue: 'globalheader--blue',
};

const GlobalHeader = ({ page }) => {
	return (
		<div className={`globalheader`}>
			stuff
		</div>
	);
}


GlobalHeader.propTypes = {
	/**
	 * text: (text)(4)
	 */
	text: PropTypes.node,

	/**
	 * button: Click here
	 */
	button: PropTypes.string.isRequired,

	/**
	 * _body: (text)(7)
	 */
	_body: PropTypes.node.isRequired,
};


GlobalHeader.defaultProps = {};


export default GlobalHeader;
