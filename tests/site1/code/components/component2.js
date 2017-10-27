import PropTypes from 'prop-types';
import React from 'react';
import List from './list';


/**
 * The Component2 component for the footer
 */
const Component2 = ( props ) => {
	const background = {
		backgroundColor: props.background,
		padding: '1em',
		marginTop: '3em',
	};

	return (
		<footer style={ background }>
			<List items={ props.links } props={ props } />
		</footer>
	);
}


Component2.propTypes = {
	/**
	 * background: '#ccc' # a CSS color here
	 */
	background: PropTypes.string.isRequired,

	/**
	 * links:
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
	links: PropTypes.array.isRequired,
};


Component2.defaultProps = {};


export default Component2;
