import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>page2 { page.title }</title>
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>{ page._partials }</div>
		</main>
	</body>
	</html>
);
