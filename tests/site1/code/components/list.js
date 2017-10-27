import PropTypes from 'prop-types';
import React from 'react';


/**
 * The List component for displaying a list
 *
 * - Internal use only -
 *
 * @disable-docs
 */
const List = ({ items, props }) => (
	<ul>
		{
			items.map( ( link, i ) =>
				<li key={ i }>
					<a href={
						link.url.startsWith('http')
							? link.url
							: props._relativeURL( link.url, props._pages[ props._ID ].url )
					}>
						{ link.title }
					</a>
				</li>
			)
		}
	</ul>
);


List.propTypes = {
	/**
	 * items:
	 *   - title: Homepage
	 *     url: /
	 *   - title: Page 1
	 *     url: /page1/
	 *   - title: Page 2
	 *     url: /page1/page2
	 *   - title: Disclaimer
	 *     url: https://en.wikipedia.org/wiki/Disclaimer
	 *   - title: Sitemap
	 *     url: https://en.wikipedia.org/wiki/Site_map
	 *   - title: About me
	 *     url: https://en.wikipedia.org/wiki/Alan_Turing
	 */
	items: PropTypes.array.isRequired,
};


List.defaultProps = {};


export default List;
