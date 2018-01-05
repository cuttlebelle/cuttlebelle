import PropTypes from 'prop-types';
import React from 'react';

const headerClasses = {
	light: 'globalheader--light',
	dark: 'globalheader--dark',
	white: 'globalheader--white',
	blue: 'globalheader--blue',
};

const headerContentClasses = {
	light: 'globalheader__content--light',
	dark: 'globalheader__content--dark',
	white: 'globalheader__content--white',
	blue: 'globalheader__content--blue',
};

/**
 * The globalheader component
 */
const GlobalHeader = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<div>
			<div className={`uikit-grid globalheader ${ headerClasses[ theme ] }`}>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<a href="/" className="globalheader__logo">
								<svg className="globalheader__logo__svg" role="img" title="The Commonwealth Star">
									<use xlinkHref={`/assets/svg/map.svg#${
										page._pages[ page._ID ].theme === 'light' || page._pages[ page._ID ].theme === 'white'
											? 'star-dark'
											: 'star'
										}`}/>
								</svg>

								<span className="globalheader__logo__title">GOV.AU</span>
							</a>
							{ page.text && <span className="globalheader__headtext">{ page.text }</span> }
							<a href="#global-header-content" className="globalheader__button js-globalheader">{ page.button }</a>
						</div>
					</div>
				</div>
			</div>

			<div id="global-header-content" className={`globalheader__content ${ headerContentClasses[ theme ] } `}>
				<div className="container">
					<div className="row">
						<div className="globalheader__content__wrapper">
							<div className="col-md-6 col-sm-6">
								<div className="globalheader__content1">
									<span className="globalheader__title">{ page.title1 }</span>
									<span className="globalheader__text">{ page.content1 }</span>
								</div>
							</div>
							<div className="col-md-6 col-sm-6">
								<div className="globalheader__content2">
									<span className="globalheader__title">{ page.title2 }</span>
									<span className="globalheader__text">{ page.content2 }</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


GlobalHeader.propTypes = {
	/**
	 * text: This is totally official
	 */
	text: PropTypes.string,

	/**
	 * button: An official website
	 */
	button: PropTypes.string.isRequired,

	/**
	 * title1: The .gov.au means its official
	 */
	title1: PropTypes.string.isRequired,

	/**
	 * content1: Lorem ipsum dolor sit amet, vix civibus deserunt te, sit eu nulla discere consulatu, ei graeci consectetuer has.
	 */
	content1: PropTypes.string.isRequired,

	/**
	 * title2: This site is also protected by SSL
	 */
	title2: PropTypes.string.isRequired,

	/**
	 * content2: Lorem ipsum dolor sit amet, vix civibus deserunt te, sit eu nulla discere consulatu, ei graeci consectetuer has.
	 */
	content2: PropTypes.string.isRequired,
};


GlobalHeader.defaultProps = {};


export default GlobalHeader;
