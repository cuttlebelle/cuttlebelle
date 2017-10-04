import React from "react";

export default ( page ) => (
	<div>
		<h2>{ page.title }</h2>
		<p>testing!</p>
		<ul>
			{ page.cards.map( ( card, i ) =>
				<li key={ i }>
					<h4>{ card.title }</h4>
					<p>{ card.content }</p>
				</li>
			)}
		</ul>
	</div>
);
