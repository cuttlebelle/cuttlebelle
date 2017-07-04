import PropTypes from 'prop-types';
import React from "react";

import { Navigation } from "./nav";


const Category = ( page ) => (
	<html>
	<head>
		<title>{ page._title }</title>

		<link rel="stylesheet" href={ `/assets/css/${ page._stylesheet }.css` } />
	</head>
	<body>
		<aside>
			<a href={ page._relativeURL( '../', page._pages[ page._ID ].url ) }>Homepage</a>
			<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
		</aside>
		<main>
			<h1>Category { page._category }</h1>
			{
				page._components && page._components.map( ( component, i ) => (
					<div key={ i }>
						code:
						<div className="">{ component.component }</div>
						<hr/>
						<pre className="">{ component.yaml }</pre>
						<hr/>
						<code><pre className="">{ component.html }</pre></code>
						{ component.file }
					</div>
				))
			}
		</main>
	</body>
	</html>
);

export default Category;
