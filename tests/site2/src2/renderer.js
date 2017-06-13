const Marked = require(`marked`);

const headingLevels = {
	1: 'uikit-display-1',
	2: 'uikit-display-2',
	3: 'uikit-display-3',
	4: 'uikit-display-4',
	5: 'uikit-display-5',
	6: 'uikit-display-6',
};

const renderer = new Marked.Renderer();

renderer.heading = ( text, level ) => {
	let display;

	if( text.startsWith('[') ) {
		const displayText = text.split(']');
		display = displayText[ 0 ].substring( 1 );

		text = displayText.splice( 1 ).join(']');
	}

	return `<h${ level }${ headingLevels[ display ] ? ` class="${ headingLevels[ display ] }"` : `` }>${ text }</h${ level }>`;
};

module.exports = renderer;
