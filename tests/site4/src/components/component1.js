import React from "react";

export default ( partial ) => (
	<div>
		<h2>{ partial.title }</h2>
		<div>{ partial._body }</div>
	</div>
);
