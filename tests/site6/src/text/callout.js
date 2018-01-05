import PropTypes from 'prop-types';
 import React from 'react';


/**
 * The callout component
 */
const Callout = ( page ) => {
	return (
	<div className={ `uikit-body uikit-grid callout` } >
		<div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="textwrapper callout__text">
						{ page._body }
					</div>
 				</div>
			</div>
		</div>
	</div>
)};


Callout.propTypes = {
	/**
	 * _body: (text)(7)
	 */
	_body: PropTypes.node.isRequired,
};


Callout.defaultProps = {};


export default Callout;
