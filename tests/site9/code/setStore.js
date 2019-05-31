import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


/**
 * The get store component
 *
 * @disable-docs
 */
class SetStore extends Component {
	constructor({ thing }) {
		super();
		this.thing = thing;
	}

	async UNSAFE_componentWillMount() {
		const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
		await Sleep( 30 );
	}

	render() {
		return (
			<Fragment>
				thing: { this.thing }
			</Fragment>
		);
	}
}

SetStore.propTypes = {};

SetStore.defaultProps = {};

export default SetStore;
