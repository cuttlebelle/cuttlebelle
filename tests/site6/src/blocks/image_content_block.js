import PropTypes from 'prop-types';
import React from 'react';

import Slugify from 'slugify';

/**
 * The Imageblock component
 */
const ImageContentblock = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';
	const imageSrc = page.image.startsWith('http') ? `${ page.image }` : `/assets/img/${ page.image }`;
	const HeadingTag = `h${ page.level }`;
	const id = page.title ? Slugify( page.title ).toLowerCase() : null;

	let imageLink = page.link;
	if( imageLink ) {
		imageLink = imageLink.startsWith('http')
			? page.link
			: `/assets/img/${ page.link }`;
	}

	const Content = (
		<div className={`imagecontentblock__content imagecontentblock__content--${ theme } `}>
			{ page.section && <span className="section__section intro__category" id={ Slugify( page.section ).toLowerCase() } >{ page.section }</span> }
			<div className="textwrapper">
				{ page.title && <HeadingTag id={ id } className={ `imagecontentblock__headline display-${ page.display }` }>
					{ page.title }
				</HeadingTag>
				}
			</div>
			{ page._body }
		</div>
	);

	const Figure = (
		<figure className="imagecontentblock__image">
			{ imageLink === undefined
				? ( <img className="imagecontentblock__image__img" src={ imageSrc } alt={ page.imageAlt } /> )
				: ( <a href={ imageLink }><img className="imagecontentblock__image__img" src={ imageSrc } alt={ page.imageAlt } /></a> )
			}
			{ page.caption && <figcaption className="imagecontentblock__image__caption">{ page.caption }</figcaption> }
		</figure>
	);

	return (
		<div className={`imagecontentblock imagecontentblock--${ theme } ${ page.stackPosition ? 'imagecontentblock--stack' + page.stackPosition : '' }   uikit-body uikit-grid`}>
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						{ page.reverse
							? Figure
							: Content
						}
					</div>
					<div className="col-md-6">
						{ page.reverse
							? Content
							: Figure
						}
					</div>
				</div>
			</div>
		</div>
	);
}


ImageContentblock.propTypes = {
	/**
	 * image: https://via.placeholder.com/500x500
	 */
	image: PropTypes.string,

	/**
	 * link: https://via.placeholder.com/500x500
	 */
	link: PropTypes.string,

	/**
	 * title: How do i get started
	 */
	title: PropTypes.string,

	/**
	 * reverse: false
	 */
	reverse: PropTypes.bool,

	/**
	 * stackPosition: top
	 */
	stackPosition: PropTypes.string,

	/**
	 * imageAlt: this is an image
	 */
	imageAlt: PropTypes.string.isRequired,

	/**
	 * caption: An example of an affinity mapping session in action.
	 */
	caption: PropTypes.string,

	/**
	 * level: 2
	 */
	level: PropTypes.number,

	/**
	 * display: 3
	 */
	display: PropTypes.number,

	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


ImageContentblock.defaultProps = {
	level: 2,
	display: 3,
};


export default ImageContentblock;
