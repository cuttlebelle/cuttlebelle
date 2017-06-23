import React from "react";

export default ( page ) => (
	<html>
	<head>
		<title>{ page.title }</title>
	</head>
	<body>
		<main>
			<h1>{ page.title }</h1>
			<div>
				{ page.main }
			</div>
		</main>
		<aside>{ page.aside }</aside>
	</body>
	</html>
);
