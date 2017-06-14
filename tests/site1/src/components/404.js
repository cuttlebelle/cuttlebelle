import React from "react";

export default ( page ) => (
	<div className="uikit-body">
		<div>{ page._body }</div>
		<ul>
			{
				Object.keys( page._sites ).map( ( site, i ) => (
					<li key={ i }>
						<a href={ `${ page._sites[ site ].url }` }>{ page._sites[ site ].title }</a>
					</li>
				))
			}
		</ul>
	</div>
);
