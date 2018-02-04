/***************************************************************************************************************************************************************
 *
 * Getting and retaining navigation infos
 *
 * Nav     - Retain nav information
 * Nav.set - Set navigation infos
 * Nav.get - Get navigation infos
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'upath';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { SETTINGS } from './settings';


/**
 * Split a path into a nested object recursively
 *
 * @param  {string} source - The string path to be nested
 * @param  {object} target - The object we carry over in the recursion
 * @param  {string} prefix - The string path we carry over in the recursion so we can build the correct IDs
 *
 * @return {object}        - A nested object representation of the string
 */
export const ToDepth = ( source, target = {}, prefix = '' ) => {
	if( typeof source === 'string' ) {
		const elements = source.split('/');
		let element = Path.normalize(`${ prefix }/${ elements.shift() }`);

		if( element.startsWith('/') ) {
			element = element.substring( 1 );
		}
		if( element.startsWith(`${ SETTINGS.get().folder.homepage }${'/'}`) ) {
			element = element.substring( SETTINGS.get().folder.homepage.length + 1 );
		}

		target[ element ] = target[ element ] || element;

		if( elements.length ) {
			target[ element ] = typeof target[ element ] === 'object' ? target[ element ] : {};

			ToDepth( elements.join('/'), target[ element ], element );
		}
	}
	else {
		return source;
	}
}


/**
 * Nest a bunch of paths into an object
 *
 * @param  {array} elements - A bunch of paths
 *
 * @return {object}         - A nested representation of the paths
 */
export const ToNested = ( elements ) => {
	let nested = {};

	if( Array.isArray( elements ) ) {
		elements.forEach( item => {
			if( !( item === SETTINGS.get().folder.homepage ) ) {
				item = `${ SETTINGS.get().folder.homepage }/${ item }`;
			}

			ToDepth( item, nested );
		});

		return nested;
	}
	else {
		return elements;
	}
};



/**
 * Retain nav information
 *
 * @type {Object}
 */
export const Nav = {
	all: [],


	/**
	 * Set navigation infos
	 *
	 * @param  {array} nav - An array of all pages IDs
	 */
	set: ( nav ) => {
		Log.verbose(`Setting nav to ${ Style.yellow( JSON.stringify( nav ) ) }`);

		Nav.all = ToNested( nav );
	},


	/**
	 * Get navigation infos
	 *
	 * @return {array} - The nested array of all pages
	 */
	get: () => {
		return Nav.all;
	},
};
