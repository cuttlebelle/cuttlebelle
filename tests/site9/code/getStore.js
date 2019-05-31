import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


/**
 * The set store component
 *
 * @disable-docs
 */
class GetStore extends Component {
	constructor({ thing }) {
		super();
		this.thing = thing;
	}

	async UNSAFE_componentWillMount() {
		const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
		await Sleep( 2000 );
		await Sleep( 2000 );
	}

	render() {
		return (
			<Fragment>
				thing: { this.thing }
			</Fragment>
		);
	}
}

GetStore.propTypes = {};

GetStore.defaultProps = {};

export default GetStore;
