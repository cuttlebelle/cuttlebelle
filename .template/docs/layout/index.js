import PropTypes from 'prop-types';
import React from "react";
import Path from 'path';

import { Navigation } from "./nav";


const Index = ( page ) => (
	<html>
	<head>
		<title>{ page._title }</title>

		<link rel="stylesheet" href={ `/assets/css/${ page._stylesheet }.css` } />
	</head>
	<body>
		<aside>
			<nav>
				<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
			</nav>
		</aside>
		<main>
			<h1>Documentation</h1>
			{ JSON.stringify( page._categories ) }<hr/>
			{ JSON.stringify( page._components ) }
			<ul>
				{
					page._categories.map( ( category, i ) => (
						<li key={ i }>
							<a href={ page._relativeURL( page._pages[ category ].url, page._ID ) }>{ page._pages[ category ].title }</a>
							<ul>
								{
									page._components.map( ( component, i ) => {
										if( category === Path.dirname( component ) || category === 'index' && Path.dirname( component ) === '.' ) {
											return <li key={ i }>
													{ component }
												</li>
										}
									})
								}
							</ul>
						</li>
					))
				}
			</ul>
		</main>
	</body>
	</html>
);

export default Index;
