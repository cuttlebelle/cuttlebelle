import PropTypes from 'prop-types';
import React from "react";


/**
 * Cards component
 *
 * @param  {object} page - Props
 */
const Cards = ( page ) => {
	const HeadingTag = `h${ page.level }`;

	return (
		<div className={ hero && 'heroclass' }>
			<HeadingTag>{ page.title }</HeadingTag>
			<p>{ page.description }</p>
			<ul>
				{ page.cards.map( ( card, i ) =>
					<li key={ i }>
						<h4>{ card.title }</h4>
						<p>{ card.content }</p>
						{ card.href && <a href={ card.href }>Learn more</a> }
					</li>
				)}
			</ul>
		</div>
	);
}


Cards.propTypes = {
	level: PropTypes.oneOf([ '1', '2', '3', '4', '5', '6' ]).isRequired,

	hero: PropTypes.bool,

	/**
	 * An optional string for the header
	 */
	cards: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string.isRequired,
			content: PropTypes.string.isRequired,
			href: PropTypes.string,
		})
	).isRequired,
};


Cards.defaultProps = {
	level: '2',
};


export default Cards;
