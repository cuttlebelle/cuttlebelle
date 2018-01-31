import PropTypes from 'prop-types';
import React from 'react';


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
											href={ relativeURL( pages[ pageID ]._url, ID ) }
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
								href={ relativeURL( pages[ page ]._url, ID ) }
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



const Index = ( page ) => (
	<html>
	<head>
		<title>{ page._title }</title>

		<link rel="stylesheet" href='assets/style.css' />
	</head>
	<body className="cuttlebelle-docs">
		<aside className="cuttlebelle-docs__aside">
			<div className="cuttlebelle-docs__wrapper">
				<span className="cuttlebelle-docs__aside__headline">Documentation</span>
				<Navigation nav={ page._nav } pages={ page._pages } ID={ page._ID } relativeURL={ page._relativeURL } />
			</div>
		</aside>
		<main className="cuttlebelle-docs__main">
			<div className="cuttlebelle-docs__wrapper">
				<h1 className="cuttlebelle-docs__main__headline">Documentation</h1>
				<p>All categories:</p>
				<ul className="cuttlebelle-docs__main__list">
					{
						page._categories.map( ( category, i ) => (
							<li key={ i } className="cuttlebelle-docs__main__list__item">
								<a className="cuttlebelle-docs__main__list__item__wrapper" href={ page._relativeURL( page._pages[ category.ID ]._url, page._ID ) }>
									<span className="cuttlebelle-docs__main__list__item__headline">{ page._pages[ category.ID ].title }</span>
									<ul className="cuttlebelle-docs__main__list__item__components">
										{
											category.components.map( ( component, i ) => (
												<li key={ i } className="cuttlebelle-docs__main__list__item__components__item">
													{ component }
												</li>
											))
										}
									</ul>
								</a>
							</li>
						))
					}
				</ul>
			</div>
		</main>
	</body>
	</html>
);

export default Index;
