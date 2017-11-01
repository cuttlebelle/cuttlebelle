import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Homepage component for the homepage layout
 */
const Homepage = ({
	_ID,
	_parents,
	_pages,
	_nav,
	_store,
	_relativeURL,
	stylesheet,
	title,
	header,
	main,
	footer
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{
			stylesheet
				&& <link rel="stylesheet" href={ _relativeURL( `/assets/css/${ stylesheet }.css`, _pages[ _ID ].url ) } />
		}
	</head>
	<body>
		{ header }
		<main>
			<div>{ main }</div>

			<div>
				<h2>All props:</h2>
				<pre><code>
_ID: { _ID }<hr/>
_parents: { JSON.stringify( _parents ) }<hr/>
_pages<br/>
index: { Object.keys( _pages['index'] ).sort().join(', ') }<br/>
index: { Object.keys( _pages['page1'] ).sort().join(', ') }<br/>
index: { Object.keys( _pages['page1/page2'] ).sort().join(', ') }<hr/>
_nav: { JSON.stringify( _nav ) }<hr/>
_store: { JSON.stringify( _store ) }<hr/>
				</code></pre>
			</div>
		</main>
		{ footer }
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
