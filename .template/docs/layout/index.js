import PropTypes from 'prop-types';
import React from "react";
import Path from 'path';

import { Navigation } from "./nav";


const Index = ( page ) => (
	<html>
	<head>
		<title>{ page._title }</title>

		<link rel="stylesheet" href='assets/style.css' />
	</head>
	<body className="cuttlebelle-docs">
		<aside className="cuttlebelle-docs__aside">
			<div className="cuttlebelle-docs__wrapper">
				<span className="cuttlebelle-docs__aside__headline">Documentation</span>
				<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
			</div>
		</aside>
		<main className="cuttlebelle-docs__main">
			<div className="cuttlebelle-docs__wrapper">
				<h1 className="cuttlebelle-docs__main__headline">Documentation</h1>
				<p>All categories:</p>
				<ul className="cuttlebelle-docs__main__list">
					{
						page._categories.map( ( category, i ) => (
							<li key={ i } className="cuttlebelle-docs__main__list__item">
								<a className="cuttlebelle-docs__main__list__item__wrapper" href={ page._relativeURL( page._pages[ category.ID ].url, page._ID ) }>
									<span className="cuttlebelle-docs__main__list__item__headline">{ page._pages[ category.ID ].title }</span>
									<ul className="cuttlebelle-docs__main__list__item__components">
										{
											category.components.map( ( component, i ) => (
												<li key={ i } className="cuttlebelle-docs__main__list__item__components__item">
													{ component }
												</li>
											))
										}
									</ul>
								</a>
							</li>
						))
					}
				</ul>
			</div>
		</main>
	</body>
	</html>
);

export default Index;
