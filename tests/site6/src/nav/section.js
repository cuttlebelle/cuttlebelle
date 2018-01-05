import PropTypes from 'prop-types';
import Slugify from 'slugify';
import React from 'react';

import { InpageNavSection } from '../../scripts/uikit/inpage-nav';


/**
 * The section component
 */
const Section = ( page ) => {

	const HeadingTag = `h${ page.level ? page.level : 2 }`;

	return (
		<div className="uikit-body uikit-grid sections">
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<HeadingTag className={ `display-3` } id={ Slugify( page.section ).toLowerCase() }>
							 { page.section }
						</HeadingTag>
					</div>
				</div>
			</div>
		</div>
	)};


Section.propTypes = {
	/**
	 * section: This important section
	 */
	section: PropTypes.string.isRequired,
};


Section.defaultProps = {
};

export default Section;
