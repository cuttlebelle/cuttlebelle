import React from "react";

export default ({ items }) => (
	<ul>
		{
			items.map( ( link, i ) =>
				<li key={ i }><a href={ link.url }>{ link.title }</a></li>
			)
		}
	</ul>
);
