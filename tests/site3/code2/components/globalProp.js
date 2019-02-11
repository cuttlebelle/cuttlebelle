import PropTypes from 'prop-types';
import React from 'react';


/**
 * The GlobalProp component for section text
 */
const GlobalProp = ({ _globalProp }) => (
	<div>
		<h2>_globalProp</h2>
		<dl>
			<dt>_globalProp.foo:</dt>
			<dd>{ _globalProp.foo }</dd>
			<dt>_globalProp.enabled:</dt>
			<dd>{ _globalProp.enabled ? 'enabled' : 'disabled' }</dd>
			<dt>_globalProp.howmuch:</dt>
			<dd>{ _globalProp.howmuch }</dd>
		</dl>
	</div>
);


GlobalProp.propTypes = {};


GlobalProp.defaultProps = {};


export default GlobalProp;
