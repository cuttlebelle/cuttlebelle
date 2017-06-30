import PropTypes from 'prop-types';
import React from "react";


const headerClasses = {
	light: 'globalheader--light',
	dark: 'globalheader--dark',
	white: 'globalheader--white',
	blue: 'globalheader--blue',
};

const GlobalHeader = ({ page }) => {
	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<div className={`globalheader ${ headerClasses[ theme ] }`}>
			<div className="container">
				<div className="globalheader__logo">
					<svg className="globalheader__logo__svg" role="img" title="The Commonwealth Star">
						<use xlinkHref={`/assets/svg/map.svg#${
							page._pages[ page._ID ].theme === 'light' || page._pages[ page._ID ].theme === 'white'
								? 'star-dark'
								: 'star'
							}`}/>
					</svg>
					<span className="globalheader__logo__title">GOV.AU</span>
				</div>
				{ page.text && <span className="globalheader__text">{ page.text }</span> }

				<a href="#global-header-content" className="globalheader__button js-globalheader">{ page.button }</a>
				<div id="global-header-content" className="globalheader__content">
					<div className="globalheader__content__wrapper">{ page._body }</div>
				</div>
			</div>
		</div>
	);
}


GlobalHeader.propTypes = {
	/**
	 * An optional string for the header
	 */
	text: PropTypes.string,

	/**
	 * @example An official website
	 */
	button: PropTypes.string.isRequired,

	/**
	 * @example [Lorem ipsum](2)
	 */
	_body: PropTypes.string.isRequired,
};


GlobalHeader.defaultProps = {};


export default GlobalHeader;
