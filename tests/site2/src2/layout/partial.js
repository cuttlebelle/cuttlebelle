import React from "react";

export default ( page ) => (
	<article>
		<h2>partial { page.title }</h2>
		<div>{ page._body }</div>
	</article>
);
