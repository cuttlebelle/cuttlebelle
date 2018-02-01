import PropTypes from 'prop-types';
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
	title,
	stylesheet,
	header,
	main,
	footer,
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{ stylesheet && <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> }
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
_relativeURL: { _relativeURL( `/assets/css/style.css`, _pages[ _ID ]._url ) }
				</code></pre>
			</div>
		</main>
		{ footer }
	</body>
	</html>
);

Homepage.propTypes = {
	/**
	 * optionalArray:
	 *   - one
	 *   - two
	 */
	optionalArray: PropTypes.array,

	/**
	 * optionalBool: true
	 */
	optionalBool: PropTypes.bool,

	/**
	 * optionalFunc: NO YAML SUPPORT
	 */
	// optionalFunc: PropTypes.func,

	/**
	 * optionalNumber: 100
	 */
	optionalNumber: PropTypes.number,

	/**
	 * optionalObject:
	 *   one: value
	 *   two: value
	 */
	optionalObject: PropTypes.object,

	/**
	 * optionalString: todo
	 */
	optionalString: PropTypes.string,

	/**
	 * optionalStringDefault: todo
	 */
	optionalStringDefault: PropTypes.string,

	/**
	 * optionalSymbol: NO YAML SUPPORT
	 */
	// optionalSymbol: PropTypes.symbol,

	/**
	 * optionalNode: (partials)(2)
	 */
	optionalNode: PropTypes.node,

	/**
	 * optionalElement: (text)(1)
	 */
	optionalElement: PropTypes.element,

	/**
	 * optionalMessage: NO YAML SUPPORT
	 */
	// optionalMessage: PropTypes.instanceOf( String ),

	/**
	 * optionalEnum: News
	 */
	optionalEnum: PropTypes.oneOf( [ 'News', 'Photos' ] ),

	/**
	 * optionalUnion: 100
	 */
	optionalUnion: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.instanceOf( String )
	]),

	/**
	 * optionalArrayOf:
	 *   - 100
	 *   - 200
	 */
	optionalArrayOf: PropTypes.arrayOf( PropTypes.number ),

	/**
	 * optionalObjectOf:
	 *   one: 100
	 *   two: 200
	 */
	optionalObjectOf: PropTypes.objectOf( PropTypes.number ),

	/**
	 * optionalObjectWithShape:
	 *  color: red
	 *  fontSize: 18
	 */
	optionalObjectWithShape: PropTypes.shape({
		color: PropTypes.string,
		fontSize: PropTypes.number
	}),

	/**
	 * requiredString: Yay
	 */
	requiredString: PropTypes.string.isRequired,

	/**
	 * requiredAny: literally anything
	 */
	requiredAny: PropTypes.any.isRequired,

	/**
	 * customProp: matchme
	 */
	customProp: function( props, propName, componentName ) {
		if( !/matchme/.test( props[ propName ] ) ) {
			return new Error(
				'Invalid prop `' + propName + '` supplied to' +
				' `' + componentName + '`. Validation failed.'
			);
		}
	},

	/**
	 * customArrayProp:
	 *  - matchme
	 *  - matchme
	 */
	customArrayProp: PropTypes.arrayOf( function( propValue, key, componentName, location, propFullName ) {
		if( !/matchme/.test( propValue[ key ] ) ) {
			return new Error(
				'Invalid prop `' + propFullName + '` supplied to' +
				' `' + componentName + '`. Validation failed.'
			);
		}
	}),
};

Homepage.defaultProps = {
	optionalStringDefault: 'test',
};

export default Homepage;
