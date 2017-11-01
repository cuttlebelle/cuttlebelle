import PropTypes from 'prop-types';
import React from 'react';
import Navigation from './navigation';


/**
 * The Page component for the default layout of pages
 */
const Page = ({
	_ID,
	_nav,
	_pages,
	_relativeURL,
	title,
	stylesheet,
	partials,
	test
}) => (
	<html>
	<head>
		<title>{ title }</title>

		{ stylesheet && <link rel="stylesheet" href={ `/assets/css/${ stylesheet }.css` } /> }
	</head>
	<body>
		<main>
			<h1>{ title }</h1>
			<Navigation nav={ _nav } pages={ _pages } ID={ _ID } relativeURL={ _relativeURL } />
			<div>{ partials }</div>
			{
				test
					&& <pre><code>
						test[0]['partial3.md'][0]['test']:<br/>
						{ JSON.stringify( test[0]['partial3.md'][0]['test'] ) }<hr/>
						test[0]['partial3.md'][1]['testing a variable with special? characters'][0]:<br/>
						{ test[0]['partial3.md'][1]['testing a variable with special? characters'][0] }<hr/>
						test[0]['partial3.md'][1]['testing a variable with special? characters'][1]:<br/>
						{ JSON.stringify( test[0]['partial3.md'][1]['testing a variable with special? characters'][1] ) }<hr/>
						test[0]['partial3.md'][1]['testing a variable with special? characters'][2]['testing']['testing']['something']:<br/>
						{ test[0]['partial3.md'][1]['testing a variable with special? characters'][2]['testing']['testing']['something'] }<hr/>
						test[0]['partial3.md'][1]['testing a variable with special? characters'][2]['testing']['testing']['testing']['testing']:<br/>
						{ test[0]['partial3.md'][1]['testing a variable with special? characters'][2]['testing']['testing']['testing']['testing'] }<hr/>
					</code></pre>
			}
		</main>
	</body>
	</html>
);


Page.propTypes = {
	/**
	 * title: Page title  # if not given, it takes the title from the current page
	 */
	title: PropTypes.string.isRequired,

	/**
	 * stylesheet: style1
	 */
	stylesheet: PropTypes.string,

	/**
	 * partials: (partials)(4)
	 */
	partials: PropTypes.node,
};


Page.defaultProps = {};


export default Page;
