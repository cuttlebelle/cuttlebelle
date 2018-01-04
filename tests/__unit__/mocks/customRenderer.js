module.exports = exports = function renderer({ Marked, _ID }) {

	Marked.heading = ( text, level ) => {
		return `<h${ level }>!${ text }!</h${ level }>`;
	};

	Marked.preparse = ( markdown ) => {
		return markdown
			.replace(/\—/g, '&mdash;');
	};

	return Marked
};
