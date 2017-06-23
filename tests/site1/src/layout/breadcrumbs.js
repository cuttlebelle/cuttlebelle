import React from "react";

export default ( page ) => {
	return (
		<nav>
			<span>You are here:</span>
			<ul>
				{ page._parents.map( ( parent, i ) =>
					<li key={ i }>
						{
							page._pages[ parent ].url === page._pages[ page._ID ].url
								? <span>{ page._pages[ parent ].title }</span>
								: <a href={ page._pages[ parent ].url }>{ page._pages[ parent ].title }</a>
						}
					</li>
				)}
			</ul>
		</nav>
	);
};
