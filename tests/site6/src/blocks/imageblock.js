import PropTypes from 'prop-types';
import React from 'react';

import Slugify from 'slugify';

/**
 * The Imageblock component
 */
const Imageblock = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';
	const backgroundImage = page.image.startsWith('http') ? ` url('${ page.image }') ` : ` url('/assets/img/${ page.image }') `;
	const reverse = page.reverse ? 'imageblock--reverse' : '';
	const bottomMargin = page.noBottomMargin ? 'imageblock--nobottommargin' : '';
	const HeadingTag = `h${ page.level }`;

	return (
		<div className={`imageblock imageblock--${ theme } ${ reverse } ${ bottomMargin } uikit-body uikit-grid`}>
			<div className="imageblock__image" style={{ backgroundImage }}>
				<div className="container">
					<div className="row">
						<div className={`imageblock__content imageblock__content--${ theme }`}>
							{ page.section && <span className="section__section intro__category" id={ Slugify( page.section ).toLowerCase() } >{ page.section }</span> }
							<div className="textwrapper">
								<HeadingTag className={ `imageblock__headline display-${ page.display }` }>
									{ page.title ? page.title : page._pages[ page._ID ].pagetitle }
								</HeadingTag>
							</div>
							{ page._body }
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


Imageblock.propTypes = {
	/**
	 * image: https://via.placeholder.com/500x500
	 */
	image: PropTypes.string,

	/**
	 * section: Content strategy
	 */
	section: PropTypes.string,

	/**
	 * title: How do i get started
	 */
	title: PropTypes.string,

	/**
	 * reverse: true
	 */
	reverse: PropTypes.bool,

	/**
	 * level: 2
	 */
	level: PropTypes.number,

	/**
	 * display: 3
	 */
	display: PropTypes.number,

	/**
	 * noBottomMargin: true
	 */
	noBottomMargin: PropTypes.bool,

	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Imageblock.defaultProps = {
	level: 2,
	display: 3,
};


export default Imageblock;
