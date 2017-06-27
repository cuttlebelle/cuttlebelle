/***************************************************************************************************************************************************************
 *
 * Getting and retaining navigation infos
 *
 * Nav          - Retain nav information
 * Nav.set      - Set navigation infos
 * Nav.get      - Get navigation infos
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';


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
	const elements = source.split("/");
	let element = Path.normalize(`${ prefix }/${ elements.shift() }`);

	if( element.startsWith('/') ) {
		element = element.slice( 1 );
	}

	target[ element ] = target[ element ] || element;

	if( elements.length ) {
		target[ element ] = typeof target[ element ] === "object" ? target[ element ] : {};

		ToDepth( elements.join("/"), target[ element ], element );
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

	elements.forEach( item => ToDepth( item, nested ) );

	return nested;
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
