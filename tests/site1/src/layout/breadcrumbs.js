import React from "react";

export default ( page ) => {
	return (
		<nav>
			<span>You are here:</span>
			<ul>
				{ page._parents.map( ( parent, i ) =>
					<li key={ i }>
						{
							page._sites[ parent ].url === page._sites[ page._myself ].url
								? <span>{ page._sites[ parent ].title }</span>
								: <a href={ page._sites[ parent ].url }>{ page._sites[ parent ].title }</a>
						}
					</li>
				)}
			</ul>
		</nav>
	);
};
