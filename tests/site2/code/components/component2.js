//@flow
import React from 'react';
import List from './list';

type Link = {
	title: string,
	url: string
}

type Component2Props = {
	/**
	 * background: '#ccc' # a CSS color here
	 */
	background: string,
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
	links: Link[]
}

/**
 * The Component2 component for the footer
 */
const Component2 = ({ background, links }: Component2Props) => {
	const backgroundStyle = {
		backgroundColor: background,
		padding: '1em',
		marginTop: '3em',
	};

	return (
		<footer style={ backgroundStyle }>
			<List items={ links } />
		</footer>
	);
}

Component2.defaultProps = {};


export default Component2;
