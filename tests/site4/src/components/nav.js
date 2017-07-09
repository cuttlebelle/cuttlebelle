import React from 'react';

/**
 * Testing
 *
 * @disable-docs
 */
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


export default Navigation;
