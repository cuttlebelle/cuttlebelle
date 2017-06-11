import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>

		<link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } />
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page._partials }</div>
		</main>
	</body>
	</html>
);
