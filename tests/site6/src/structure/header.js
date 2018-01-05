import PropTypes from 'prop-types';
import React from 'react';

import Breadcrumbs from '../../scripts/uikit/breadcrumbs';


/**
 * The header component
 */
const Header = ( page ) => {
	const breadcrumbs = [];

	page._parents
		.filter( parent => parent !== 'index' )
		.map( ( parent ) => breadcrumbs.push({
			link: ( page._pages[ parent ].url === page._pages[ page._ID ].url ? undefined : page._pages[ parent ].url ),
			text: page._pages[ parent ].pagetitle,
	}));

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<div className={`header header--${ theme }`} id="content">
			<div className="container">
				<div className="row">
					<div className="col-md-12 header__sub">
						<a href="/" title="Guides home">
							<img className="header__logo" src={`/assets/img/coa${ theme === 'blue' || theme === 'dark' ? '-white' : '' }.png`}
								alt="The Australian Government coat of Arms"/>
						</a>
						<div className="header__text">
							<a href="/" className="header__text__headline">
								{
									page._pages[ page._ID ]['header-title']
										? page._pages[ page._ID ]['header-title']
										: 'Guides'
								}
							</a>
						</div>

						<a href="https://www.surveymonkey.com/r/XFWJ5TC" className="feedback__btn uikit-btn">
							Give feedback
						</a>

						<div className="header__breadcrumbs" id="nav">
							{
								breadcrumbs.length > 1
									? <Breadcrumbs label="Breadcrumb for this page" items={ breadcrumbs } inverted={ theme === 'blue' || theme === 'dark' } />
									: null
							}
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}


Header.propTypes = {};


Header.defaultProps = {};


export default Header;
