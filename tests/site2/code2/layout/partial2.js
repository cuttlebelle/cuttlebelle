import React from "react";

export default ( page ) => (
	<article>
		<h2>partial2 { page.title }</h2>
		<div>{ page._body }</div>
	</article>
);
