/***************************************************************************************************************************************************************
 *
 * Getting infos from our site
 *
 * GetContent   - Get all content folders recursively
 * GetLayout    - Get all layout files recursively
 * ToDepth      - Split a path into a nested object recursively
 * ToNested     - Nest a bunch of paths into an object
 * Nav          - Retain nav information
 * Nav.set      - Set navigation infos
 * Nav.get      - Get navigation infos
 * Pages        - Reading all pages frontmatter and keeping them for later lookup
 * Pages.get    - Get the stored frontmatter
 * Pages.setAll - Set all frontmatter to store
 * Pages.set    - Set one pages frontmatter into the store
 * Pages.inject - Inject the data into our global placeholder
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';
import { ParseYaml } from './parse';
import { ReadFile } from './files';


/**
 * Get all folders recursively that have the index.yml (or whatever SETTINGS.folder.index says)
 *
 * @param  {string} folder    - The start folder we search in
 * @param  {array}  structure - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}            - An array of all relative paths that should be pages we need to generate
 */
export const GetContent = ( folder = SETTINGS.get().folder.content, content = []) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                              // starting from this level
			.map(
				file => {                                                                         // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {                  // if this is a directory we just call ourself again
						const result = GetContent( Path.join( folder, file ), content );              // shoot off a recursive call
						content = [ ...result ];                                              // and spread the result into our content array
					}
					else {
						if( file === `${ SETTINGS.get().folder.index }.yml` ) {                       // we only want the index.yml files and ignore (shared) folder
							Log.verbose(`Found content in ${ Style.yellow( folder ) }`);

							const replaceString = SETTINGS.get().folder.cwd + SETTINGS.get().folder.content.replace( SETTINGS.get().folder.cwd, '' );

							content.push( folder.replace( replaceString, '' ) );
						}
					}
				}
			);

		return content;
	}
	else {
		Log.info(`No content found in ${ Style.yellow( folder ) }`)
	}
};


/**
 * Get all layout files recursively
 *
 * @param  {string} folder    - The start folder we search in
 * @param  {array}  structure - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}            - An array of all relative paths that should be pages we need to generate
 */
export const GetLayout = ( folder = SETTINGS.get().folder.src, structure = [] ) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                          // starting from this level
			.map(
				file => {                                                                     // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {              // if this is a directory we just call ourself again
						structure = [ ...GetLayout( Path.join( folder, file ), structure ) ];     // and spread the result into our array
					}
					else {
						if( Path.extname( file ) === '.js' ) {                                    // we only want js files and ignore invisible files
							Log.verbose(`Found layout in ${ Style.yellow( Path.join( folder, file ) ) }`);

							const replaceString = SETTINGS.get().folder.cwd + SETTINGS.get().folder.src.replace( SETTINGS.get().folder.cwd, '' );

							structure.push( Path.join( folder, file ).replace( replaceString, '' ) );
						}
					}
				}
			);

		return structure;
	}
	else {
		Log.info(`No react source found in ${ Style.yellow( folder ) }`)
	}
};


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


/**
 * Reading all pages frontmatter and keeping them for later lookup
 *
 * @type {Object}
 */
export const Pages = {
	/**
	 * The store of all frontmatter of all pages
	 *
	 * @type {Object}
	 */
	all: {},


	/**
	 * Get the stored frontmatter
	 *
	 * @return {object} - All frontmatter for each page
	 */
	get: () => {
		Log.verbose(`All pages frontmatter:\n${ Style.yellow( JSON.stringify( Pages.all ) ) }`);

		return Pages.all;
	},


	/**
	 * Set all frontmatter to store
	 *
	 * @param  {array}  pages   - All pages that need to be read and stored
	 *
	 * @return {promise object} - Resolves once all pages are stored
	 */
	setAll: ( pages = [] ) => {
		Log.verbose(`Setting pages frontmatter for: ${ Style.yellow( JSON.stringify( pages ) ) }`);

		const allPages = [];

		return new Promise( ( resolve, reject ) => {

			pages.forEach( page => {
				allPages.push( Pages.set( page ) );
			});

			Promise.all( allPages )
				.catch( error => {
					reject( JSON.stringify( error ) );
				})
				.then( () => {
					resolve();
				});
		});
	},


	/**
	 * Set one pages frontmatter into the store
	 *
	 * @param  {string} page - The name of the page
	 *
	 * @return {object}      - An object with all frontmatter inside it's ID key, format: { name: 'ID', [ID]: {} }
	 */
	set: ( page ) => {
		Log.verbose(`Setting page frontmatter for ${ Style.yellow( page ) }`);

		const content = Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }.yml`);

		return new Promise( ( resolve, reject ) => {
			ReadFile( content )
				.catch( error => reject( JSON.stringify( error ) ) )
				.then( body => resolve({
					name: page,
					...Pages.inject( page, ParseYaml( body, page ) )
				}));
		});
	},


	/**
	 * Inject the data into our global placeholder
	 *
	 * @param  {string} page - The name (ID) of the page
	 * @param  {object} data - The data to be injected
	 *
	 * @return {object}      - The data with generated url
	 */
	inject: ( page, data ) => {
		Log.verbose(`Injecting page data for ${ Style.yellow( page ) } to ${ Style.yellow( JSON.stringify( data ) ) }`);

		let url = `${ SETTINGS.get().site.root }${ page }`;

		if( page === SETTINGS.get().folder.homepage ) {
			url = `${ SETTINGS.get().site.root }`;
		}

		data = JSON.parse( JSON.stringify( data ) ); // cloning
		data = { url: url, ...data };

		Pages.all[ page ] = data;

		return data;
	}
};
