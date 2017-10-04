import React from "react";

export default ( page ) => (
	<div className="uikit-body">
		<div>{ page._body }</div>
		<ul>
			{
				Object.keys( page._pages ).map( ( site, i ) => (
					<li key={ i }>
						<a href={ `${ page._pages[ site ].url }` }>{ page._pages[ site ].title }</a>
					</li>
				))
			}
		</ul>
	</div>
);
