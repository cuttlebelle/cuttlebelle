import React from "react";
import Nested from "./nested2";

export default ( page ) => (
	<div>
		<h3>Nesting components</h3>
		<Nested page={ page } />
	</div>
);
