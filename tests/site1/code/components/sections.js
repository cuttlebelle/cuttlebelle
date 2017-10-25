import React from "react";

export default ( page ) => (
	<div>
		{ page._parseMD( page.headline ) }
	</div>
);
