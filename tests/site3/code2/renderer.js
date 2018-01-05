module.exports = exports = function renderer({ Marked, _ID, _relativeURL }) {

	const headingLevels = {
		1: 'display-1',
		2: 'display-2',
		3: 'display-3',
		4: 'display-4',
		5: 'display-5',
		6: 'display-6',
	};

	Marked.heading = ( text, level ) => {
		let display;

		if( text.startsWith('[') ) {
			const displayText = text.split(']');
			display = displayText[ 0 ].substring( 1 );

			text = displayText.splice( 1 ).join(']');
		}

		return `<h${ level }${ headingLevels[ display ] ? ` class="${ headingLevels[ display ] }"` : `` }>${ text }</h${ level }>`;
	};

	Marked.link = ( href, title, text ) => {
		let attr = '';
		if( href.startsWith('http://') || href.startsWith('https://') ) {
			attr = ` rel="external"`;
		}
		else if( !href.startsWith('#') && typeof _relativeURL === 'function' ) {
			href = _relativeURL( href, _ID );
		}

		return `<a href="${ href }"${ title ? ` title="${ title }"` : '' }${ attr }>${ text }</a>`;
	};

	Marked.preparse = ( markdown ) => {
		return markdown
			.replace(/\—/g, '&mdash;')
			.replace(/\–/g, '&ndash;')
			.replace(/\"/g, '&quot;')
			.replace(/\'/g, '&apos;')
			.replace(/\.\.\./g, '&hellip;');
	};

	return Marked;
};
