/***************************************************************************************************************************************************************
 *
 * Getting infos from our site
 *
 * GetContent   - Get all content folders recursively
 * GetLayout    - Get all layout files recursively
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
export const GetContent = ( folder = SETTINGS.get().folder.content, structure = [] ) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                       // starting from this level
			.map(
				file => {                                                                  // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {           // if this is a directory we just call ourself again
						structure = [ ...GetContent( Path.join( folder, file ), structure ) ]; // and spread the result into our array
					}
					else {
						if( file === SETTINGS.get().folder.index ) {                           // we only want the index.yml files and ignore (shared) folder without pages
							Log.verbose(`Found content in ${ Style.yellow( folder ) }`);

							const replaceString = SETTINGS.get().folder.cwd + SETTINGS.get().folder.content.replace( SETTINGS.get().folder.cwd, '' );

							structure.push( folder.replace( replaceString, '' ) );
						}
					}
				}
			);

		return structure;
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
				.then( pages => {
					pages.map( page => Pages.all[ page.name ] = page[ page.name ] );

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

		const content = Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }`);

		return new Promise( ( resolve, reject ) => {
			ReadFile( content )
				.catch( error => reject( JSON.stringify( error ) ) )
				.then( body => resolve({
					name: page,
					...Pages.inject( page, ParseYaml( body ) )
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
		Log.verbose(`Injecting page data for ${ Style.yellow( page ) } to ${ Style.yellow( JSON.stringify( page ) ) }`);

		let url = `${ SETTINGS.get().site.root }${ page }`;

		if( page === SETTINGS.get().folder.homepage ) {
			url = `${ SETTINGS.get().site.root }`;
		}

		data = { url: url, ...data };

		Pages.all[ page ] = data;

		return data;
	}
};
