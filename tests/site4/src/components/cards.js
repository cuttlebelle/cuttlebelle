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
		<div className={ page.hero && 'heroclass' }>
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
	/**
	 * level: "2"
	 */
	level: PropTypes.oneOf([ '1', '2', '3', '4', '5', '6' ]).isRequired,

	/**
	 * hero: true
	 */
	hero: PropTypes.bool,

	/**
	 * cards:
	 *   - title: yay
	 *     content: Some content
	 *     href: http://link/to
	 *   - title: yay
	 *     content: Some content
	 *     href: http://link/to
	 *   - title: yay
	 *     content: Some content
	 *     href: http://link/to
	 *   - title: yay
	 *     content: Some content
	 *     href: http://link/to
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
