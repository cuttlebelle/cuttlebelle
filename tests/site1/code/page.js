import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>

		{ page.stylesheet && <link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } /> }
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page.partials }</div>
		</main>
	</body>
	</html>
);
