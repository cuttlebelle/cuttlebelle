/***************************************************************************************************************************************************************
 *
 * Interact with the file system
 *
 * GetContent - Get all content folders recursively
 * GetLayout  - Get all layout files recursively
 * ReadFile   - Promisified reading a file
 * CreateFile - Promisified writing a file
 * CreateDir  - Create a path if it doesn’t exist
 * RemoveDir  - Removing folders and all it’s sub folders
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Del from 'del';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS, Log, Style } from './helper';


/**
 * Get all folders recursively that have the index.yml (or whatever SETTINGS.folder.index says)
 *
 * @param  {string} folder    - The start folder we search in
 * @param  {array}  structure - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}            - An array of all relative paths that should be pages we need to generate
 */
export const GetContent = ( folder = SETTINGS.folder.content, structure = [] ) => {
	Fs.readdirSync( folder )                                                       // starting from this level
		.map(
			file => {                                                                  // iterate over all files
				if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {           // if this is a directory we just call ourself again
					structure = [ ...GetContent( Path.join( folder, file ), structure ) ]; // and spread the result into our array
				}
				else {
					if( file === SETTINGS.folder.index ) {                                 // we only want the index.yml files and ignore (shared) folder without pages
						Log.verbose(`Found content in ${ Style.yellow( folder ) }`);

						const replaceString = SETTINGS.folder.cwd + SETTINGS.folder.content.replace( SETTINGS.folder.cwd, '' );

						structure.push( folder.replace( replaceString, '' ) );
					}
				}
			}
		);

	return structure;
};


/**
 * Get all layout files recursively
 *
 * @param  {string} folder    - The start folder we search in
 * @param  {array}  structure - We keep track of what we found so far to recursively find all folders
 *
 * @return {array}            - An array of all relative paths that should be pages we need to generate
 */
export const GetLayout = ( folder = SETTINGS.folder.src, structure = [] ) => {
	Fs.readdirSync( folder )                                                          // starting from this level
		.map(
			file => {                                                                     // iterate over all files
				if( Fs.statSync( Path.join( folder, file ) ).isDirectory() ) {              // if this is a directory we just call ourself again
					structure = [ ...GetLayout( Path.join( folder, file ), structure ) ];     // and spread the result into our array
				}
				else {
					if( Path.extname( file ) === '.js' ) {                                    // we only want js files and ignore invisible files
						Log.verbose(`Found layout in ${ Style.yellow( Path.join( folder, file ) ) }`);

						const replaceString = SETTINGS.folder.cwd + SETTINGS.folder.src.replace( SETTINGS.folder.cwd, '' );

						structure.push( Path.join( folder, file ).replace( replaceString, '' ) );
					}
				}
			}
		);

	return structure;
};


// export const GetSites = ( content = [] ) => {
// };


/**
 * Promisified reading a file
 *
 * @param  {string} location - The location of the file to be read
 *
 * @return {promise object}  - The content of the file
 */
export const ReadFile = location => {
	return new Promise( ( resolve, reject ) => {
		Fs.readFile( location, `utf8`, ( error, content ) => {
			if( error ) {
				Log.error(`Reading file failed for ${ Style.yellow( location ) }`);
				Log.error( JSON.stringify( error ) );

				reject( error );
			}
			else {
				Log.verbose(`Successfully read ${ Style.yellow( location ) }`);

				resolve( content );
			}
		});
	});
};


/**
 * Promisified writing a file
 *
 * @param  {string} location - The location the file should be written to
 * @param  {string} content  - The content of the file
 *
 * @return {promise object}  - Boolean true for 👍 || string error for 👎
 */
export const CreateFile = ( location, content ) => {
	CreateDir( Path.dirname( location ) );

	return new Promise( ( resolve, reject ) => {
		Fs.writeFile( location, content, `utf8`, ( error ) => {
			if( error ) {
				Log.error(`Writing file failed for ${ Style.yellow( location ) }`);
				Log.error( JSON.stringify( error ) );

				reject( error );
			}
			else {
				Log.verbose(`Successfully written ${ Style.yellow( location ) }`);

				resolve( true );
			}
		});
	});
};


/**
 * Create a path if it doesn’t exist
 *
 * @param  {string} dir - The path to be checked and created if not found
 *
 * @return {string}     - The path that was just worked at
 */
export const CreateDir = ( dir ) => {
	Log.verbose(`Creating path ${ Style.yellow( dir ) }`);

	const splitPath = dir.split( Path.sep );

	splitPath.reduce( ( path, subPath ) => {
		let currentPath;

		if( /^win/.test( process.platform ) && path === '' ) { // when using windows (post truth) at beginning of the path
			path = './';                                         // we add the prefix to make sure it works on windows (yuck)
		}

		if( subPath != '.' ) {
			currentPath = Path.normalize(`${ path }/${ subPath }`);

			Log.verbose(`Checking if ${ Style.yellow( currentPath ) } exists`)

			if( !Fs.existsSync( currentPath ) ){
				try {
					Fs.mkdirSync( currentPath );

					Log.verbose(`Successfully ${ Style.yellow( currentPath ) } created`)
				}
				catch( error ) {
					Log.error(`Error when creating the folder ${ Style.yellow( currentPath ) } for path ${ Style.yellow( dir ) }`);
					Log.error( error );

					process.exit( 1 );
				}
			}
		}
		else {
			currentPath = subPath;
		}

		return currentPath;
	}, '');

	return splitPath.join( Path.sep );
};


/**
 * Removing folders and all it’s sub folders
 *
 * @param  {array} dir      - An array of all folders to be removed
 */
export const RemoveDir = ( dir ) => {
	try {
		Del.sync( dir );
		Log.verbose(`Removed ${ Style.yellow( JSON.stringify( dir ) ) } folder`)
	}
	catch( error ) {
		Log.error( error );
	}
}
