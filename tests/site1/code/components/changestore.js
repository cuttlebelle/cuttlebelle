import React from "react";

export default ( partial ) => {
	partial._storeSet({ stuff: 'yay!' });

	return (
		<div>
			<h2>{ partial.title }</h2>
			<p>Store: { JSON.stringify( partial._store() ) }</p>
			<div>{ partial._body }</div>
		</div>
	);
};
