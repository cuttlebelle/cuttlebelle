import PropTypes from 'prop-types';
import React from "react";


const Navigation = ({
	nav = {},
	pages = {},
	ID = '',
	relativeURL = ( URL ) => URL,
	noParents = false,
	level = 0,
	wrappingClass = 'cuttlebelle-nav',
	itemClass = 'cuttlebelle-nav__item',
	nestedItemClass = 'cuttlebelle-nav__item--has-nested',
	levelClass = 'cuttlebelle-nav--level-',
	ancorClass = 'cuttlebelle-nav__item__anchor',
	spanClass = 'cuttlebelle-nav__item__span',
	noanchorClass = 'cuttlebelle-nav__item--noanchor',
}) => (
	<ul className={`${ wrappingClass } ${ levelClass }${ level }`}>
		{
			Object.keys( nav ).map( ( pageID, i ) => {
				const page = nav[ pageID ];
				const _displayItem = noParents && pageID.startsWith( ID ) || !noParents;

				if( typeof page === 'object' ) {
					if( noParents && ID.startsWith( pageID ) || !noParents ) {
						return <li className={`${ itemClass } ${ nestedItemClass }`} key={ i }>
							{
								typeof pages[ pageID ] != 'undefined' && _displayItem
									? <NavigationItem
											href={ relativeURL( pages[ pageID ].url, ID ) }
											title={ pages[ pageID ].title }
											thisPage={ pageID === ID }
											itemClass={ itemClass }
											ancorClass={ ancorClass }
											spanClass={ spanClass }
										/>
									: null
							}

							<Navigation
								nav={ page }
								pages={ pages }
								ID={ ID }
								relativeURL={ relativeURL }
								noParents={ noParents }
								level={ level + 1 }
								wrappingClass={ wrappingClass }
								itemClass={ itemClass }
								nestedItemClass={ nestedItemClass }
								levelClass={ levelClass }
								ancorClass={ ancorClass }
								spanClass={ spanClass }
								noanchorClass={ noanchorClass }
							/>
						</li>
					}
				}
				else {
					if( _displayItem ) {
						return <li className={ itemClass } key={ i }>
							<NavigationItem
								href={ relativeURL( pages[ page ].url, ID ) }
								title={ pages[ page ].title }
								thisPage={ page === ID }
								itemClass={ itemClass }
								ancorClass={ ancorClass }
								spanClass={ spanClass }
							/>
						</li>
					}
				}
			})
		}
	</ul>
);


const NavigationItem = ({ itemClass, ancorClass, spanClass, href, title, thisPage }) => {
	if( thisPage ) {
		return <span className={ spanClass }>{ title }</span>;
	}
	else {
		return <a className={ ancorClass } href={ href }>{ title }</a>
	}
};



const Category = ( page ) => (
	<html>
	<head>
		<title>{ page._title }</title>

		<link rel="stylesheet" href={ `${ '../'.repeat( page._level + 1 ) }assets/style.css` } />
		{
			page._css.map( ( css, i ) => <link key={ i } rel="stylesheet" href={ `${ '../'.repeat( page._level + 1 ) }assets/pages/${ css }` } /> )
		}
	</head>
	<body className="cuttlebelle-docs">
		<aside className="cuttlebelle-docs__aside">
			<div className="cuttlebelle-docs__wrapper">
				<a className="cuttlebelle-docs__aside__headline" href={ page._relativeURL( '../', page._pages[ page._ID ].url ) }>Documentation</a>
				<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
			</div>
		</aside>
		<main className="cuttlebelle-docs__main">
			<div className="cuttlebelle-docs__wrapper">
				<h1 className="cuttlebelle-docs__main__headline">Category { page._ID }</h1>
				<p>In this category</p>
				<ul className="cuttlebelle-docs__main__contents">
				{
					page._components && page._components.map( ( component, i ) => (
						<li key={ i } className="cuttlebelle-docs__main__contents__item">
							<a href={`#${ component.file.replace( '.js', '' ) }`} className="cuttlebelle-docs__main__contents__item__link">
								{ component.file.replace( '.js', '' ) }
							</a>
						</li>
					))
				}
				</ul>
				{
					page._components && page._components.map( ( component, i ) => (
						<div key={ i } id={ component.file.replace( '.js', '' ) } className="cuttlebelle-docs__main__component">
							<h2 className="cuttlebelle-docs__main__component__name">{ component.file.replace( '.js', '' ) }</h2>
							<div className="cuttlebelle-docs__main__component__example">{ component.component }</div>
							<pre className="cuttlebelle-docs__main__component__yaml">{ component.yaml }</pre>
							<details className="cuttlebelle-docs__main__component__html">
								<summary className="cuttlebelle-docs__main__component__html__showhide">Show/Hide</summary>
								<pre><code>{ component.html }</code></pre>
							</details>
						</div>
					))
				}
			</div>
		</main>
	</body>
	</html>
);

export default Category;
