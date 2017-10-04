import React from "react";

export default ({ page }) => (
	<div>
		<h4>Nested</h4>
		{ JSON.stringify(page) }
		{ page._pages[ page._ID ].title }
	</div>
);
