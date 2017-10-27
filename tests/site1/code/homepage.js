import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Homepage component for the homepage layout
 */
const Homepage = ( props ) => (
	<html>
	<head>
		<title>{ props.title }</title>

		{
			props.stylesheet
				&& <link rel="stylesheet" href={ props._relativeURL( `/assets/css/${ props.stylesheet }.css`, props._pages[ props._ID ].url ) } />
		}
	</head>
	<body>
		{ props.header }
		<main>
			<div>{ props.main }</div>

			<div>
				<h2>All props:</h2>
				<pre><code>
_ID: { props._ID }<hr/>
_parents: { JSON.stringify( props._parents ) }<hr/>
_pages<br/>
index: { Object.keys( props._pages['index'] ).sort().join(', ') }<br/>
index: { Object.keys( props._pages['page1'] ).sort().join(', ') }<br/>
index: { Object.keys( props._pages['page1/page2'] ).sort().join(', ') }<hr/>
_nav: { JSON.stringify( props._nav ) }<hr/>
_store: { JSON.stringify( props._store ) }<hr/>
				</code></pre>
			</div>
		</main>
		{ props.footer }
	</body>
	</html>
);


Homepage.propTypes = {
	/**
	 * stylesheet: style1
	 */
	stylesheet: PropTypes.string.isRequired,

	/**
	 * header: (partials)(4)
	 */
	header: PropTypes.node,

	/**
	 * main: (partials)(4)
	 */
	main: PropTypes.node.isRequired,

	/**
	 * footer: (partials)(4)
	 */
	footer: PropTypes.node,
};


Homepage.defaultProps = {};


export default Homepage;
