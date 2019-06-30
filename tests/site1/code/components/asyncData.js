import React, { Component } from 'react';
import PropTypes from 'prop-types';


/**
 * The set store component
 *
 * @disable-docs
 */
class AsyncData extends Component {
	constructor({ data = 'unset', _self }) {
		super();
		this.data = data;
		this._self = _self;
	}

	static async getInitialProps( props ) {
		const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
		await Sleep( 2000 );
		return { data: `fetched! ${ Object.keys( props ).sort().join(', ') }` }
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

AsyncData.propTypes = {};

AsyncData.defaultProps = {};

export default AsyncData;
