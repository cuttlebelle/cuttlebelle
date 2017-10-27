import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Sections component for section text
 */
const Sections = ( props ) => (
	<div>
		{ props._parseMD( props.headline ) }
	</div>
);


Sections.propTypes = {
	/**
	 * headline: "Headline with **markdown** allowed"
	 */
	headline: PropTypes.string.isRequired,
};


Sections.defaultProps = {};


export default Sections;
