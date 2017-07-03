import PropTypes from 'prop-types';
import React from "react";


const Category = ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>

		<link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } />
	</head>
	<body>
		<main>
			<h1>Category { page.category }</h1>
			{
				page.components && page.components.map( ( component, i ) => (
					<div key={ i }>
						{ component.file }
					</div>
				))
			}
		</main>
	</body>
	</html>
);

export default Category;
