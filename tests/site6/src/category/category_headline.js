import PropTypes from 'prop-types';
import React from 'react';

// LOCAL
import GlobalHeader from '../structure/globalheader';
/**
 * The category heading component
 */
const CategoryHeadline = ( page ) => {
	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<div className={`uikit-body uikit-grid category-headline category-headline--${ theme }`}>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="category-headline__title">{ page.title }</div>
					</div>
				</div>
			</div>
		</div>
	);
};


CategoryHeadline.propTypes = {
	/**
	 * title: Content strategy
	 */
	title: PropTypes.string.isRequired,
};


CategoryHeadline.defaultProps = {};


export default CategoryHeadline;
