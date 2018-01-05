import PropTypes from 'prop-types';
import React from 'react';

// LOCAL
import Card from './card';


/**
 * The partial component
 */
const CardsCategory = ( page ) => (
	<div className={`uikit-body uikit-grid cards cards--category`}>
		<div className="container">
			<ul className="cards__list">
				{
					page.cards.map( ( card, i ) => (
						<li key={ i } className="col-sm-6 col-md-4 col-lg-3 cards__list__item">
							<Card
								link={ card.link }
								background={ card.background }
								image={ card.image }
								headline={ card.headline }
								text={ card.text }
								cta={ card.cta }
							/>
						</li>
					))
				}
			</ul>

			{ page.cardsLink && <a className="cards__link uikit-cta-link" href={ `${ page.cardsLink.url }` }>{ page.cardsLink.text }</a> }
		</div>
	</div>
);


CardsCategory.propTypes = {
	/**
	 * cards:
	 *   - image: http://via.placeholder.com/350x150
	 *     headline: Agile delivery
	 *     text: How to work in an agile way: principles, tools and governance.
	 *     link: '#url'
	 *     background: rebeccapurple
	 *   - image: http://via.placeholder.com/350x150
	 *     headline: Agile delivery
	 *     text: How to work in an agile way: principles, tools and governance.
	 *     link: '#url'
	 *     background: rebeccapurple
	 *   - image: http://via.placeholder.com/350x150
	 *     headline: Agile delivery
	 *     text: How to work in an agile way: principles, tools and governance.
	 *     link: '#url'
	 *     cta: Blah!
	 *     background: rebeccapurple
	 */
	cards: PropTypes.array.isRequired,

	/**
	 * cardsLink:
	 *   text: View more
	 *   url: /content-strategy/content-auditing
	 */
	cardsLink: PropTypes.shape({
		/**
		 * text: View more
		 */
		text: PropTypes.string.isRequired,

		/**
		 * url: /content-strategy/content-auditing
		 */
		url: PropTypes.string.isRequired
	})
};


CardsCategory.defaultProps = {};


export default CardsCategory;
