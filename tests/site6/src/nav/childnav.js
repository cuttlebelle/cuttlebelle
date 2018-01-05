import PropTypes from 'prop-types';
import React from 'react';

// LOCAL
import Navigation from './nav';


/**
 * Childnav for use in intro_with_nav
 *
 * @disable-docs
 */
const Childnav = ({ page }) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';
	const parentID = page._parents[ ( page._parents.length - ( page._parents.length - 1 ) )];
	const childNavTitle = page.childnavtitle == undefined ? 'In this category' : page.childnavtitle;
	const childnav1lvl = page.childnav1lvl ? page.childnav1lvl : page._pages[ page._ID ].childnav1lvl;

	return (
		<div className={`childnav js-childnav childnav--${ theme }`}>
			<div className="childnav__container">
				<button className="childnav__controls">{ childNavTitle }</ button>
				<Navigation
					wrappingId="childnav-list"
					wrappingClass="childnav__list"
					noParents={ true }
					nav={ page._nav }
					pages={ page._pages }
					ID={ page._ID }
					childnav1lvl={ childnav1lvl }
					startID={ parentID }
					relativeURL={ page._relativeURL }
				/>
			</div>
		</div>
	);
}


Childnav.propTypes = {};


Childnav.defaultProps = {};


export default Childnav;
