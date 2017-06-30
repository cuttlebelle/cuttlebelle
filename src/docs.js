/***************************************************************************************************************************************************************
 *
 * Build documentation from your react layouts
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const ReactDocs = require('react-docgen');
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile, CreateFile, CreateDir, RemoveDir, CopyFiles } from './files';
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';
import { GetLayout } from './site';


export const BuildDocs = () => {
	Log.info(`Generating docs`);

	const layouts = GetLayout();
	const categories = GetCategories( layouts );
	const allLayouts = [];

	layouts.map( layout => {
		allLayouts.push(
			GetInfos( layout )
				.catch( error => reject( error ) )
		);
	});

	return new Promise( ( resolve, reject ) => {
		Promise.all( allLayouts )
			.catch( error => reject( error ) )
			.then( infos => {
				console.log(infos);

				resolve();
		});
	});
}


/**
 * Get all categories from our src/ folders
 *
 * @param  {array} layouts - An array of all layout components
 *
 * @return {array}         - An array of all category paths
 */
export const GetCategories = ( layouts ) => {
	Log.verbose(`Getting all categories`);

	const categories = [];

	layouts.map( layout => {
		const category = Path.dirname( layout );

		if( !categories.includes( category ) ) {
			categories.push( category );
		}
	});

	return categories;
}


/**
 * Get infos about a react component by running it through our propType parser
 *
 * @param  {string} layout  - The path to the layout file
 *
 * @return {Promise object} - The object with all gathered infos
 */
export const GetInfos = ( layout ) => {
	Log.verbose(`Getting layout infos from ${ Style.yellow( layout ) }`);

	return new Promise( ( resolve, reject ) => {

		const componentPath = Path.normalize(`${ SETTINGS.get().folder.src }/${ layout }`);

		ReadFile( componentPath )
			.catch( error => reject( error ) )
			.then( react => resolve({
				file: layout,
				...ReactDocs.parse( react ),
			})
		);
	});
};
