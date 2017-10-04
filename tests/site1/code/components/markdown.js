import React from "react";

export default ( page ) => (
	<div>
		<h3>Markdown compilation</h3>
		<div>{ page._parseMD( page.yourMarkdown ) }</div>
	</div>
);
