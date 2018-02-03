/***************************************************************************************************************************************************************
 *
 * Getting and storing frontmatter for later reuse
 *
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
import Path from 'upath';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';
import { ParseYaml } from './parse';
import { ReadFile } from './files';


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
		data = { ...Pages.all[ page ], ...data };
		data._url = url; // adding url last so it can’t ever be overwritten

		Pages.all[ page ] = data;

		return data;
	}
};
