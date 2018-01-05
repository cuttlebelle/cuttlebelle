import PropTypes from 'prop-types';
import Slugify from 'slugify';
import React from 'react';


/**
 * The plaintextblock component
 */
const Plaintextblock = ( page ) => {

	// replace <p> with /n
	let template = page._body.props.dangerouslySetInnerHTML.__html.replace(/<\/p[\s\/]*>/gm, "\n");
	// strip other tags
	template = template.replace(/(<([^>]+)>)/ig,"");

	return (
	<div className={ `uikit-body uikit-grid plaintextblock` } >
		<div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="plaintextwrapper">
						<textarea value={ template } readOnly="true" />
					</div>
				</div>
			</div>
		</div>
	</div>
)};


Plaintextblock.propTypes = {
	/**
	 * _body: (text)(7)
	 */
	_body: PropTypes.node.isRequired,
};


Plaintextblock.defaultProps = {};


export default Plaintextblock;
