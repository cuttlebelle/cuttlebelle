import PropTypes from 'prop-types';
import React from 'react';

// LOCAL
import Navigation from '../nav/nav';


/**
 * 404 Page layout
 *
 * @disable-docs
 */
const Page404 = ( page ) => (
	<div className="uikit-body uikit-grid sitemap">
		<div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="textwrapper">
						<div className="sitemap__text">{ page._body }</div>
						<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
					</div>
				</div>
			</div>
		</div>
	</div>
);


Page404.propTypes = {
	/**
	 * _body: (partials)(1)
	 */
	_body: PropTypes.node.isRequired,
};


Page404.defaultProps = {};


export default Page404;
