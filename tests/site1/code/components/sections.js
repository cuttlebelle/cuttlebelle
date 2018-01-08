import PropTypes from 'prop-types';
import React, { Fragment } from 'react';


/**
 * The Sections component for section text
 */
const Sections = ({ _parseMD, headline }) => (
	<Fragment>
		{ _parseMD( headline ) }
	</Fragment>
);


Sections.propTypes = {
	/**
	 * headline: "Headline with **markdown** allowed"
	 */
	headline: PropTypes.string.isRequired,
};


Sections.defaultProps = {};


export default Sections;
