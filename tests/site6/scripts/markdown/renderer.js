// https://github.com/chjj/marked

module.exports = exports = function renderer({ Marked, _ID }) {

	/**
	 * Heading level classes
	 *
	 * @type {Object}
	 */
	const headingLevels = {
		1: 'display-1',
		2: 'display-2',
		3: 'display-3',
		4: 'display-4',
		5: 'display-5',
		6: 'display-6',
	};


	/**
	 * Heading overwrite
	 *
	 * @param  {string}  text  - The text of the heading
	 * @param  {integer} level - The level of the heading
	 *
	 * @return {string}        - The rendered HTML
	 */
	Marked.heading = ( text, level ) => {
		let display;

		if( text.startsWith('[') ) {
			const displayText = text.split(']');
			display = displayText[ 0 ].substring( 1 );

			text = displayText.splice( 1 ).join(']');
		}
		else {
			display = Object.keys( headingLevels ).reverse()[ level ];
		}

		return `<h${ level }${ headingLevels[ display ] ? ` class="${ headingLevels[ display ] }"` : `` }>${ text }</h${ level }>`;
	};


	/**
	 * Link overwrite
	 *
	 * @param  {string} href  - The href attribute
	 * @param  {string} title - The title attribute
	 * @param  {string} text  - The text string
	 *
	 * @return {string}       - The rendered HTML
	 */
	Marked.link = ( href, title, text ) => {
		let attr = '';
		if( href.startsWith('http://') || href.startsWith('https://') ) {
			attr = ` rel="external"`;
		}

		return `<a href="${ href }"${ title ? ` title="${ title }"` : '' }${ attr }>${ text }</a>`;
	};


	/**
	 * Pre-parse function
	 *
	 * @param  {string} markdown - The markdown coming from our partials
	 *
	 * @return {string}          - The markdown after we’re finished with it
	 */
	Marked.preparse = ( markdown ) => {
		return markdown
			.replace(/\—/g, '<span class="markdown-mdash">&mdash;</span>')
			.replace(/\–/g, '<span class="markdown-ndash">&ndash;</span>')
			.replace(/\.\.\./g, '<span class="markdown-ellipsis">&hellip;</span>');
	};


	return Marked
};
