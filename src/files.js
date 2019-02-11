/***************************************************************************************************************************************************************
 *
 * Interact with the file system
 *
 * ReadFile   - Promisified reading a file
 * CreateFile - Promisified writing a file
 * CreateDir  - Create a path if it doesn’t exist
 * RemoveDir  - Removing folders and all it’s sub folders
 * CopyFiles  - Copy a folder
 *
 * @flow
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import FsExtra from 'fs-extra';
import Del from 'del';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { Path } from './path';


/**
 * Promisified reading a file
 *
 * @param  {string} location - The location of the file to be read
 *
 * @return {promise object}  - The content of the file
 */
export const ReadFile = ( location /*: string */ ) /*: Promise<string | Error> */ => {
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
export const CreateFile = ( location /*: string */, content /*: string */ ) /*: Promise<Error | boolean> */ => {
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
export const CreateDir = ( dir /*: string */ ) /*: string */ => {
	Log.verbose(`Creating path ${ Style.yellow( dir ) }`);

	const splitPath = dir.split('/');

	splitPath.reduce( ( path, subPath ) => {
		let currentPath;

		if( /^win/.test( process.platform ) && path === '' ) { // when using windows (post truth) at beginning of the path
			path = './';                                         // we add the prefix to make sure it works on windows (yuck)
		}

		if( subPath != '.' ) {
			currentPath = Path.normalize(`${ path }/${ subPath }`);

			// Log.verbose(`Checking if ${ Style.yellow( currentPath ) } exists`)

			if( !Fs.existsSync( currentPath ) ) {
				try {
					Fs.mkdirSync( currentPath );

					Log.verbose(`Successfully created ${ Style.yellow( currentPath ) }`)
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

	return splitPath.join('/');
};


/**
 * Removing folders and all it’s sub folders
 *
 * @param  {array} dir      - An array of all folders to be removed
 */
export const RemoveDir = ( dir /*: string[] */ ) => {
	try {
		Del.sync( dir );
		Log.verbose(`Removed ${ Style.yellow( JSON.stringify( dir ) ) } folder`)
	}
	catch( error ) {
		Log.error( error );
	}
}


/**
 * Copy files or folder
 *
 * @param  {string} source      - The absolute path to the source
 * @param  {string} destination - The absolute path to the destination
 *
 * @return {promise object}     - Resolved once completed
 */
export const CopyFiles = ( source /*: string */, destination /*: string */ ) /*: Promise<?Error> */ => {
	Log.verbose(`Copy folder from ${ Style.yellow( source ) } to ${ Style.yellow( destination ) }`);

	return new Promise( ( resolve, reject ) => {
		if( Fs.existsSync( source ) ) {
			FsExtra.copy( source, destination, ( error /*: Error */ ) => {
				if( error ) {
					reject( error );
				}

				resolve();
			});
		}
		else {
			Log.verbose(`No folder found at ${ Style.yellow( source ) }`);

			resolve();
		}
	});
}
