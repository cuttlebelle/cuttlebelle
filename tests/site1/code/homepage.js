import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>

		{ page.stylesheet && <link rel="stylesheet" href={ `/assets/css/${ page.stylesheet }.css` } /> }
	</head>
	<body>
		{ page.header }
		<main>
			<div>{ page.main }</div>
		</main>
		{ page.footer }
	</body>
	</html>
);
