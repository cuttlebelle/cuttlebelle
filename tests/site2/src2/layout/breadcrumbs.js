import React from "react";

export default ( page ) => {
	return (
		<nav>
			<span>You are here:</span>
			<ul>
				{ page._parents.map( ( parent, i ) =>
					<li key={ i }>
						{  }
						<a href={ parent }>{ parent }</a>
					</li>
				)}
			</ul>
		</nav>
	);
};
