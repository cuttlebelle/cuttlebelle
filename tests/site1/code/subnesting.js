import React from "react";

export default ( page ) => (
	<article>
		<h2>{ page.title }</h2>
		{ page.subnest }
		<div>{ page._body }</div>
	</article>
);
