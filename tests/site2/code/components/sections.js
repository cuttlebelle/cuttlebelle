import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Sections component for section text
 */
const Sections = ({ _parseMD, modifier, headline }) => (
	<div className={`thing thing--${ modifier }`}>
		{ _parseMD( headline ) }
	</div>
);


Sections.propTypes = {
	/**
	 * headline: "Headline with **markdown** allowed"
	 */
	headline: PropTypes.string.isRequired,

	/**
	 * modifier: light
	 */
	modifier: PropTypes.oneOf(['light', 'dark']),
};


Sections.defaultProps = {};


export default Sections;
