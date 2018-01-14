import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Component1 component for the header
 */
const Component1 = ({
	_ID,
	_pages,
	_storeSet,
	_store,
	_body
}) => {
	_storeSet({ title: _pages[ _ID ].title }); // getting the title from the store (to test the store)

	return (
		<header>
			<h1>{ _store()['title'] }</h1>
			<div>{ _body }</div>
		</header>
	);
}


Component1.propTypes = {
	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Component1.defaultProps = {};


export default Component1;
