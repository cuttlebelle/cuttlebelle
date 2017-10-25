import React from "react";
import List from "./list";

export default ( props ) => {
	const background = {
		backgroundColor: props.background,
		padding: '1em',
		marginTop: '3em',
	};

	return (
		<footer style={ background }>
			<List items={ props.links } />
		</footer>
	);
}
