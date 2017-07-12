const Marked = require(`marked`);

const renderer = new Marked.Renderer();

renderer.heading = ( text, level ) => {
	return `<h${ level }>!${ text }!</h${ level }>`;
};


renderer.preparse = ( markdown ) => {
	return markdown
		.replace(/\—/g, '&mdash;');
};

module.exports = renderer;
