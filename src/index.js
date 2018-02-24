#!/usr/bin/env node
/***************************************************************************************************************************************************************
 *
 * Generate static files from the content folder with react components
 *
 * This is where we delegate the program and get it all started
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ConvertHrtime, ExitHandler, Style, Log, Notify } from './helper.js';
import { DisplayHelp, DisplayVersion, DisplayWelcome } from './cli.js';
import { RenderAllPages, RenderAssets, PreRender } from './render.js';
import { SETTINGS } from './settings.js';
import { BuildDocs } from './docs';
import { Watch } from './watch.js';
import { Init } from './init.js';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLI options
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// help flag
if( process.argv.includes('-h') || process.argv.includes('help') ) {
	DisplayHelp();
}


// version flag
if( process.argv.includes('-V') || process.argv.includes('--version') ) {
	DisplayVersion();
}


// keep track of execution time
const startTime = process.hrtime();


DisplayWelcome();


// verbose flag
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}


// silent flag
if( process.argv.includes('-s') || process.argv.includes('--silent') ) {
	Notify.silent = true;
}


// set watch flag
if( process.argv.includes('-w') || process.argv.includes('watch') ) {
	Watch.running = true;
}


// merging default settings with package.json
const pkgLocation = Path.normalize(`${ process.cwd() }/package.json`);
if( Fs.existsSync( pkgLocation ) ) {
	const loacalPkg = require( pkgLocation );
	SETTINGS.set( loacalPkg.cuttlebelle );
}


// run init before building
if( process.argv.includes('-i') || process.argv.includes('init') ) {
	Init();
}


// build docs
if( process.argv.includes('-d') || process.argv.includes('docs') ) {
	( async function () {
		try {
			const pages = await BuildDocs();
			const elapsedTime = process.hrtime( startTime );

			Log.done(
				`${ pages > 0 ? `Successfully built ${ Style.yellow( pages ) } doc pages ` : `No doc pages have been build ` }` +
				`to ${ Style.yellow( SETTINGS.get().folder.docs.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
				`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
			);

			process.exit( 0 );
		}
		catch (error) {
			Log.error(`Trying to generate the docs failed.`);
			Log.error( error );

			process.exit( 1 );
		}
	})();
}

// build site
else {
	// pre-render everything
	( async function () {
		try {
			const { content, layout } = await PreRender();

			if( content.length === 0 ) {
				Log.info(`Nothing to generate; consider running ${ Style.yellow(`cuttlebelle init`) } to get a clean slate.`);

				const elapsedTime = process.hrtime( startTime );
				Log.done(`Done in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`);
			}
			else {

				// generate all files unless it’s disabled
				if( !process.argv.includes('-n') && !process.argv.includes('--no-generate') ) {
					Log.info(`Generating pages`);

					let assetsLocation = SETTINGS.get().folder.assets.split( Path.sep );
					assetsLocation = Path.normalize(`${ SETTINGS.get().folder.site }/${ assetsLocation[ assetsLocation.length - 2 ] }/`);

					try {
						const pages = await Promise.all([
							RenderAssets(
								SETTINGS.get().folder.assets,
								assetsLocation
							),
							RenderAllPages( content, layout )
						]);

						const elapsedTime = process.hrtime( startTime );

						Log.done(
							`${ pages.length > 0 ? `Successfully built ${ Style.yellow( pages[ 1 ].length ) } pages ` : `No pages have been build ` }` +
							`to ${ Style.yellow( SETTINGS.get().folder.site.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
							`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
						);

						// run watch on flag
						if( Watch.running ) {
							Watch.start();
						}
					}
					catch( error ) {
						Log.error(`Generating pages failed :(`);
						Log.error( error );

						process.exit( 1 );
					}
				}
				else {
					// run watch on flag
					if( process.argv.includes('-w') || process.argv.includes('watch') ) {
						Watch.start();
					}
				}
			}
		}
		catch( error ) {
			Log.error(`Trying to initilize the pages failed.`);
			Log.error( error );

			process.exit( 1 );
		}
	})();
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exit handler
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
process.on( 'exit', ExitHandler.bind( null, { withoutSpace: false } ) );              // on closing
process.on( 'SIGINT', ExitHandler.bind( null, { withoutSpace: true } ) );             // on [ctrl] + [c]
process.on( 'uncaughtException', ExitHandler.bind( null, { withoutSpace: false } ) ); // on uncaught exceptions
