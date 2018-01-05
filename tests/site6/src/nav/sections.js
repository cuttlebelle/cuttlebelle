import PropTypes from 'prop-types';
import Slugify from 'slugify';
import React from 'react';

import { InpageNavLinksItem, InpageNavLinks } from '../../scripts/uikit/inpage-nav';


/**
 * The sections component
 */
const Sections = ( page ) => {
	const sections = [];

	page.sections.map( ( section ) => sections.push({
		link: Slugify( section ).toLowerCase(),
		title: section,
	}));

	return (
		<div className="uikit-body uikit-grid sections">
			<div className="container">
				<div className="row">
					<div className="col-md-6 js-sections">
						<InpageNavLinks title="In this section" sections={ sections } title={ page.title } />
					</div>
				</div>
			</div>
		</div>
	);
};


Sections.propTypes = {
	/**
	 * title: Contents
	 */
	title: PropTypes.string,

	/**
	 * sections:
	 *   - First section
	 *   - Second section
	 *   - Even more sections
	 *   - Last section
	 */
	sections: PropTypes.array.isRequired,
};


Sections.defaultProps = {
	title: 'Contents',
};


export default Sections;
