import PropTypes from 'prop-types';
import React from 'react';


/**
 * The banner component
 */
const Banner = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';
	const HeadingTag = `h${ page.level }`;

	return (
		<div className={`uikit-body uikit-grid banner banner--${ theme }`}>
			<div className="container">
				<div className="row">
					<div className="col-md-6 col-sm-7">

						{ page.section && <span className="section__section">{ page.section }</span> }
						<div className="textwrapper">
							<HeadingTag className={ `banner__headline display-3` }>
								{ page.title ? page.title : page._pages[ page._ID ].pagetitle }
							</HeadingTag>
						</div>

						<div className="textwrapper">
							<div className="banner__description">
								{ page._body }
							</div>
						</div>
					</div>
					<div className="col-md-6 col-sm-5">
						<div className="banner__box">
							<h3 className="banner__box__headline display-1">{ page.boxHeading }</h3>
							<a id={ page.linkText } className="banner__box__link uikit-cta-link" href={ `${ page.linkUrl }` }>{ page.linkText }</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


Banner.propTypes = {
	/**
	 * section: Digital service standard
	 */
	section: PropTypes.string,

	/**
	 * title: Digital Service Standard
	 */
	title: PropTypes.string.isRequired,

	/**
	 * boxHeading: What is the Digital Service Standard?
	 */
	boxHeading: PropTypes.string.isRequired,

	/**
	 * linkText: What is the Digital Service Standard?
	 */
	linkText: PropTypes.string.isRequired,

	 /**
	  * linkUrl: http://google.com
	  */
	linkUrl: PropTypes.string.isRequired,

	/**
	 * level: 2
	 */
	level: PropTypes.number,

	/**
	 * _body: (text)(1)
	 */
	_body: PropTypes.node,
};


Banner.defaultProps = {
	level: 2
};


export default Banner;
