/***************************************************************************************************************************************************************
 *
 * Getting infos from our site
 *
 * GetType      - Get an array of paths recursively from a folder
 * GetContent   - Get all content folders recursively
 * GetPartials  - Get all partial files recursively
 * GetLayout    - Get all layout files recursively
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { SETTINGS } from './settings';
import { Path } from './path';


/**
 * Get all folders recursively that meet a condition
 *
 * @param  {string}   folder     - The start folder we search in
 * @param  {function} condition  - A function to find the right type of file
 * @param  {function} format     - A function to format the paths
 * @param  {array}    files      - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}               - An array of all paths
 */
export const GetType = ( folder, condition, format, files = [] ) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                                // starting from this level
			.map(
				file => {                                                                           // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {                    // if this is a directory we just call ourself again
						files = [ ...GetType( Path.join( folder, file ), condition, format, files ) ];  // and spread the result into our array
					}
					else {
						if( condition( file ) ) {                                                       // let’s see if we include this file
							Log.verbose(`Found type in ${ Style.yellow( Path.join( folder, file ) ) }`);
							files.push( format( folder, file ) );
						}
					}
				}
			);

		return files;
	}
	else {
		return null;
	}
};


/**
 * Get all folders that have the index.yml (or whatever SETTINGS.folder.index says)
 *
 * @param  {string}  folder  - The start folder we search in
 *
 * @return {array}           - An array of all relative paths that should be pages we need to generate
 */
export const GetContent = ( folder = SETTINGS.get().folder.content ) => {
	const condition = file => file === `${ SETTINGS.get().folder.index }.yml`;
	const replacePathString = Path.normalize( SETTINGS.get().folder.cwd + folder.replace( SETTINGS.get().folder.cwd, '' ) );
	const format = ( folder, _ ) => folder.replace( replacePathString, '' );

	const files = GetType( folder, condition, format );

	if( files === null ) {
		Log.info(`No content found in ${ Style.yellow( folder ) }`)
	}
	else {
		return files;
	}
}


/**
 * Get all partials from all content folders
 *
 * @param  {string}  folder  - The start folder we search in
 *
 * @return {array}           - An array of all relative paths of all partials
 */
export const GetPartials = ( folder = SETTINGS.get().folder.content ) => {
	const condition = file => file.endsWith('.md');
	const replacePathString = Path.normalize( SETTINGS.get().folder.cwd + folder.replace( SETTINGS.get().folder.cwd, '' ) );
	const format = ( folder, file ) => Path.join( folder, file ).replace( replacePathString, '' );

	const files = GetType( folder, condition, format );

	if( files === null ) {
		Log.info(`No partials found in ${ Style.yellow( folder ) }`)
	}
	else {
		return files;
	}
}


/**
 * Get all layout files recursively
 *
 * @param  {string}  folder  - The start folder we search in
 *
 * @return {array}           - An array of all relative paths that we see as layouts
 */
export const GetLayout = ( folder = SETTINGS.get().folder.code ) => {
	const condition = file => Path.extname( file ) === '.js';
	const replacePathString = Path.normalize( SETTINGS.get().folder.cwd + folder.replace( SETTINGS.get().folder.cwd, '' ) );
	const format = ( folder, file ) => Path.join( folder, file ).replace( replacePathString, '' );

	const files = GetType( folder, condition, format );

	if( files === null ) {
		Log.info(`No react source found in ${ Style.yellow( folder ) }`)
	}
	else {
		return files;
	}
}
