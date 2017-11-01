import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Sections component for section text
 */
const Sections = ({ _parseMD, headline }) => (
	<div>
		{ _parseMD( headline ) }
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
