import React, { Component } from 'react';
import PropTypes from 'prop-types';


/**
 * The set store component
 *
 * @disable-docs
 */
class SyncData extends Component {
	constructor({ data = 'unset', _self }) {
		super();
		this.data = data;
		this._self = _self;
	}

	static getInitialProps() {
		return { data: 'set' }
	}

	render() {
		return (
			<div>
				<hr/>
				<p><small>{ this._self }</small></p>
				data: { this.data }
				<hr/>
			</div>
		);
	}
}

SyncData.propTypes = {};

SyncData.defaultProps = {};

export default SyncData;
