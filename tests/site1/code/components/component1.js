import React from "react";

export default ( props ) => {
	props._storeSet({ title: props._pages[ props._ID ].title });

	return (
		<header>
			<h1>{ props._store()['title'] }</h1>
			<div>{ props._body }</div>
		</header>
	);
}
