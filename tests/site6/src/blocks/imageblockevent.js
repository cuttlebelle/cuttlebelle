import PropTypes from 'prop-types';
import React from 'react';

import Slugify from 'slugify';

/**
 * Imageblockevent for use on page
 */
const Imageblockevent = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';
	const backgroundImage = page.image.startsWith('http') ? ` url('${ page.image }') ` : ` url('/assets/img/${ page.image }') `;
	const reverse = page.reverse ? 'imageblock--reverse' : '';

	const date = page.event.date;
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	const eventDate = `${ date.getDay() } ${ monthNames[date.getMonth()] } ${ date.getFullYear() }`;

	const HeadingTag = `h${ page.level }`;

	return (
		<div className={`imageblock imageblockevent imageblock--${ theme } ${ reverse } uikit-body uikit-grid`}>
			<div className="imageblock__image" style={{ backgroundImage }}>
				<div className="container">
					<div className="row">
						<div className={`imageblock__content imageblock__content--${ theme }`}>

							{ page.section && <h3 className="section__section intro__category" id={ Slugify( page.section ).toLowerCase() } >{ page.section }</h3> }

							<div className="textwrapper">
								<HeadingTag className={ `imageblock__headline display-${ page.display }` }>
									{ page.title ? page.title : page._pages[ page._ID ].pagetitle }
								</HeadingTag>
							</div>

							<div className={`eventblock eventblock--${ theme }`}>
								<div className="eventblock__title__wrapper">
									{ page.event.title && <span className="eventblock__title">{ page.event.title }</span> }
								</div>

								<div className="eventblock__datewrapper">
									<svg className="eventblock__date__svg" role="img" title="Calendar date">
										<use xlinkHref='/assets/svg/map.svg#calendar' />
									</svg>
									<span className="eventblock__date">{ eventDate } - </span>
									{ page.event.location && <span className="eventblock__location">{ page.event.location }</span> }
								</div>

								{ page.event.description && <span className="eventblock__description">{ page.event.description }</span> }
							</div>

							{ page._body }

						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


Imageblockevent.propTypes = {
	/**
	 * image: https://via.placeholder.com/500x500
	 */
	image: PropTypes.string.isRequired,

	/**
	 * section: Content strategy
	 */
	section: PropTypes.string.isRequired,

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
	 * event:
	 *   title: Introduction training on user research
	 *   date: 2017-12-20
	 *   location: Canberra
	 *   description: Find out how to get started with user research.
	 */
	event: PropTypes.shape({
		title: PropTypes.string,
		date: PropTypes.instanceOf( Date ).isRequired,
		location: PropTypes.string,
		description: PropTypes.string,
	}),

	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Imageblockevent.defaultProps = {
	level: 2,
	display: 3,
};


export default Imageblockevent;
