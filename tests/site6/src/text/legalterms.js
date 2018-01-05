import PropTypes from 'prop-types';
import React from 'react';


/**
 * The legalterm component to be used inside the footer
 */
const LegalTerms = ( page ) => (
	<div className="uikit-body uikit-grid legalterms">
		<div className="container">
			<div className="row">
				<div className="col-sm-12">
					{ page._body }
				</div>
			</div>
		</div>
	</div>
);


LegalTerms.propTypes = {
	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


LegalTerms.defaultProps = {};


export default LegalTerms;
