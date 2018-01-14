import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Component1 component for the header
 */
const Component1 = ({
	_ID,
	_self,
	_parents,
	_body,
	_pages,
	_storeSet,
	_store
}) => {
	_storeSet({ title: _pages[ _ID ].title }); // getting the title from the store (to test the store)

	const ulStyling = {
		display: 'inline-block',
		listStyle: 'none',
		padding: 0,
	};

	const liStyling = {
		display: 'inline-block',
		margin: '0 0 0 1em',
	};

	return (
		<header>
			<h1>{ _store()['title'] }</h1>
			<div>
				breadcrumbs:
				<ul style={ ulStyling }>
					{
						_parents.map( ( parent, i ) =>
							<li key={ i } style={ liStyling }>
								<a href={ _pages[ parent ]._url }>{ _pages[ parent ].title }</a>
							</li>
						)
					}
				</ul>
				<p><small>{ _self }</small></p>
			</div>
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
