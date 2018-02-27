import PropTypes from 'prop-types';
import Partial from './partial';
import React from 'react';


/**
 * The Homepage component for the homepage layout
 */
const Homepage = ({
	_ID,
	_self,
	_isDocs,
	_parents,
	_pages,
	_nav,
	_store,
	_relativeURL,
	_parseYaml,
	_parseReact,
	_parseMD,
	stylesheet,
	title,
	header,
	main,
	footer,
	...rest
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{
			stylesheet
				&& <link rel="stylesheet" href={ _relativeURL( `/assets/css/${ stylesheet }.css`, _pages[ _ID ]._url ) } />
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
_self: { _self }<hr/>
_isDocs: { JSON.stringify( _isDocs ) }<hr/>
_parents: { JSON.stringify( _parents ) }<hr/>
_pages<br/>
index: { Object.keys( _pages['index'] ).sort().join(', ') }<br/>
index: { Object.keys( _pages['page1'] ).sort().join(', ') }<br/>
index: { typeof _pages['page1/page2'] === 'object' ? Object.keys( _pages['page1/page2'] ).sort().join(', ') : null }<hr/>
_nav: { JSON.stringify( _nav ) }<hr/>
_store: { JSON.stringify( _store() ) }<hr/>
_relativeURL: { _relativeURL( `/assets/css/style.css`, _pages[ _ID ]._url ) }<hr/>
_parseYaml: { JSON.stringify( _parseYaml('test:\n  - one\n  - two') ) }<hr/>
_parseMD: { _parseMD('This is **markdown**!') }<hr/>
_parseReact: <textarea defaultValue={ _parseReact( <Partial _body="hello world" title="Title" _self="this.md" /> ) }/><hr/>
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
	 * title: homepage
	 */
	title: PropTypes.string.isRequired,

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
