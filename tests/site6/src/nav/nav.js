import PropTypes from 'prop-types';
import React from 'react';


/**
 * Navigation for use in other components
 *
 * @disable-docs
 */
const Navigation = ({
	nav = {},
	pages = {},
	ID = '',
	startID = '',
	relativeURL = ( URL ) => URL,
	noParents = false,
	level = 0,
	childnav1lvl = false,
	homepageName = '',
	wrappingId = '',
	wrappingClass = 'navigation',
	itemClass = 'navigation__item',
	nestedItemClass = 'navigation__item--has-nested',
	levelClass = 'navigation--level-',
	ancorClass = 'navigation__item__anchor',
	spanClass = 'navigation__item__span',
	noanchorClass = 'navigation__item--noanchor',
}) => (

	<ul { ...( wrappingId && { id: wrappingId } ) } className={`${ wrappingClass } ${ levelClass }${ level }`}>
		{
			Object.keys( nav )
				.filter( ( key ) => pages[ key ].hidden === undefined || pages[ key ].hidden === false ) // hiding pages that have hidden set to not false
				.sort( ( keyA, keyB ) => pages[ keyA ].weight - pages[ keyB ].weight )                   // sort by weight
				.map( ( pageID, i ) => {
					const homepage = homepageName === '' ? Object.keys( nav )[ 0 ] : homepageName;
					const page = nav[ pageID ];
					const _displayItem =  noParents && (pageID.startsWith( startID ) && (pageID.charAt(startID.length) == '' || pageID.charAt(startID.length) == '/') ) || level === 2 && childnav1lvl === true || !noParents;

					// We only pursue this element if it either
					// starts with our startID or is the homepage if we got noParents = true
					// But we will only print the name of the element if the element starts with startID and noParents = true

					if( typeof page === 'object' ) {

						if(
							_displayItem ||
							noParents && startID.startsWith( pageID ) ||
							noParents && pageID === homepage
						) {
							return <li className={`${ itemClass } ${ nestedItemClass }`} key={ i }>
								{
									_displayItem
										? <NavigationItem
												href={ relativeURL( pages[ pageID ].url, ID ) }
												title={ pages[ pageID ].pagetitle }
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
									startID={ startID }
									relativeURL={ relativeURL }
									noParents={ noParents }
									level={ level + 1 }
									childnav1lvl={ childnav1lvl }
									homepageName={ homepage }
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
						// Check to see if this is a childnav placed on 1 level only and add the parent item on the first item
						if (childnav1lvl == true && level === 2 && i === 0) {
							const parentId = pageID.substring(0, pageID.indexOf('/'));
							const parent = pages[parentId];

							return <li key={ i } className={ itemClass }>

										<NavigationItem
											href={ relativeURL( pages[ page ].url, ID ) }
											title={ pages[ page ].pagetitle }
											thisPage={ page === ID }
											itemClass={ itemClass }
											ancorClass={ ancorClass }
											spanClass={ spanClass }
											childnav1lvl={ childnav1lvl }
										/>

									</li>

						}else if( _displayItem ) {

							return <li className={ itemClass } key={ i }>

								<NavigationItem
									href={ relativeURL( pages[ page ].url, ID ) }
									title={ pages[ page ].pagetitle }
									thisPage={ page === ID }
									itemClass={ itemClass }
									ancorClass={ ancorClass }
									spanClass={ spanClass }
 									childnav1lvl={ childnav1lvl }
								/>
							</li>
						}
					}
			})
		}
	</ul>
);


const NavigationItem = ({ itemClass, ancorClass, spanClass, href, title, thisPage, index, childnav1lvl }) => {

	if( thisPage ) {
		return <span className={ spanClass }>{ title }</span>;
	}
	else {
		return <a className={ ancorClass } href={ href }>{ title }</a>
	}
};


export default Navigation;
