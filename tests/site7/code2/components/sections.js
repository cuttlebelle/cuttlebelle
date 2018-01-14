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
	 * headline: |
	 *   ## Intro
	 *
	 *   **Welcome to my site**
	 *
	 *   Also check out the other pages: [page1](/page1) and [page2](/page1/page2)
	 *   A bunch more links would be [website](http://cuttlebelle.com/) and a [hash link](#below).
	 */
	headline: PropTypes.string.isRequired,
};


Sections.defaultProps = {};


export default Sections;
