/***************************************************************************************************************************************************************
 *
 * Getting infos from our site
 *
 * GetContent   - Get all content folders recursively
 * GetLayout    - Get all layout files recursively
 * ToDepth      - Split a path into a nested object recursively
 * ToNested     - Nest a bunch of paths into an object
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
 * Get all folders recursively that have the index.yml (or whatever SETTINGS.folder.index says)
 *
 * @param  {string} folder    - The start folder we search in
 * @param  {array}  structure - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}            - An array of all relative paths that should be pages we need to generate
 */
export const GetContent = ( folder = SETTINGS.get().folder.content, content = []) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                 // starting from this level
			.map(
				file => {                                                            // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {     // if this is a directory we just call ourself again
						const result = GetContent( Path.join( folder, file ), content ); // shoot off a recursive call
						content = [ ...result ];                                         // and spread the result into our content array
					}
					else {
						if( file === `${ SETTINGS.get().folder.index }.yml` ) {          // we only want the index.yml files and ignore (shared) folder
							Log.verbose(`Found content in ${ Style.yellow( folder ) }`);

							const replaceString = Path.normalize( SETTINGS.get().folder.cwd + SETTINGS.get().folder.content.replace( SETTINGS.get().folder.cwd, '' ) );

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
export const GetLayout = ( folder = SETTINGS.get().folder.code, structure = [] ) => {
	if( Fs.existsSync( folder ) ) {
		Fs.readdirSync( folder )                                                      // starting from this level
			.map(
				file => {                                                                 // iterate over all files
					if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {          // if this is a directory we just call ourself again
						structure = [ ...GetLayout( Path.join( folder, file ), structure ) ]; // and spread the result into our array
					}
					else {
						if( Path.extname( file ) === '.js' ) {                                // we only want js files and ignore invisible files
							Log.verbose(`Found layout in ${ Style.yellow( Path.join( folder, file ) ) }`);

							const replaceString = Path.normalize( SETTINGS.get().folder.cwd + SETTINGS.get().folder.code.replace( SETTINGS.get().folder.cwd, '' ) );

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
