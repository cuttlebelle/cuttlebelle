#!/usr/bin/env node
/***************************************************************************************************************************************************************
 *
 * Generate static files from the content folder with react components
 *
 * Handel cli options in this file
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderAllPages, RenderAssets } from './render.js';
import { GetContent, GetLayout, Pages, Nav } from './site';
import { SETTINGS } from './settings.js';
import { Progress } from './progress';
import { Watch } from './watch.js';
import Size from 'window-size';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ConvertHrtime, ExitHandler, Style, Log, Notify } from './helper.js';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLI options
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const pkg = require('../package.json');


// help flag
if( process.argv.includes('-h') || process.argv.includes('--help') ) {
	const maxLength = 80;
	const paddingSize = Math.max( 0, Math.floor( ( Size.width - maxLength ) / 2 ) );
	const padding = String.repeat(` `, paddingSize );

	Log.space();
	console.log(`
${ padding }╔═╗ ╦ ╦ ╔╦╗ ╔╦╗ ╦   ╔═╗ ╔╗  ╔═╗ ╦   ╦   ╔═╗
${ padding }║   ║ ║  ║   ║  ║   ║╣  ╠╩╗ ║╣  ║   ║   ║╣
${ padding }╚═╝ ╚═╝  ╩   ╩  ╩═╝ ╚═╝ ╚═╝ ╚═╝ ╩═╝ ╩═╝ ╚═╝ v${ pkg.version }

${ padding }The react.js static site generator with editing in mind.

${ padding }Options:
${ padding }  ${ Style.bold(`version`) }     - Display the version of Cuttlebelle
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-V`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --version`) ) }

${ padding }  ${ Style.bold(`watch`) }       - Start to watch the content and source folder for changes
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-w`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --watch`) ) }

${ padding }  ${ Style.bold(`no-generate`) } - Disable generation of all pages, best in combination with watch.
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-n`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --no-generate --watch`) ) }

${ padding }  ${ Style.bold(`silent`) }      - Disable all notifications the watch might throw
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-s`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --silent --watch`) ) }

${ padding }  ${ Style.bold(`verbose`) }     - Enable silly verbose mode
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-v`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --verbose`) ) }

${ padding }  ${ Style.gray( pkg.homepage ) }
`);
	Log.space();

	process.exit( 0 );
}


if( process.argv.includes('-V') || process.argv.includes('--version') ) {
	console.log(`Cuttlebelle v${ pkg.version }`);
	process.exit( 0 );
}


// keep track of execution time
const startTime = process.hrtime();


Log.welcome(`Cuttlebelle v${ pkg.version }`);


// verbose flag
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}


// silent flag
if( process.argv.includes('-s') || process.argv.includes('--silent') ) {
	Notify.silent = true;
}


// set watch flag
if( process.argv.includes('-w') || process.argv.includes('--watch') ) {
	Watch.running = true;
}


// merging default settings with package.json
const pkgLocation = Path.normalize(`${ process.cwd() }/package.json`);
if( Fs.existsSync( pkgLocation ) ) {
	const loacalPkg = require( pkgLocation );
	SETTINGS.set( loacalPkg.cuttlebelle );
}


// Getting all pages
const content = GetContent();
Log.verbose(`Found following content: ${ Style.yellow( JSON.stringify( content ) ) }`);

// Setting nav globally
Nav.set( content );

// Getting all layout components
const layout = GetLayout();
Log.verbose(`Found following layout:\n${ Style.yellow( JSON.stringify( layout ) ) }`);


// Setting how many pages we will have to go through
Progress.set( content.length );


// Get all front matter from all pages and put them into a global var
Pages
	.setAll( content )
	.catch( error => {
		Log.error(`Trying to initilize the pages failed.`);
		Log.error( error );

		process.exit( 1 );
	})
	.then( () => {

		// generate all files unless it’s disabled
		if( !process.argv.includes('-n') && !process.argv.includes('--no-generate') ) {
			Log.info(`Generating pages`);

			const allPromises = [];

			// copy all asset files to the site/ folder
			allPromises.push(
				RenderAssets(
					SETTINGS.get().folder.assets,
					Path.normalize(`${ SETTINGS.get().folder.site }/${ SETTINGS.get().folder.assets.replace( SETTINGS.get().folder.cwd, '' ) }`)
				)
			);

			// render all pages to site/
			allPromises.push( RenderAllPages( content, layout ) );

			Promise.all( allPromises )
				.catch( error => {
					Log.error(`Generating pages failed :(`);
					Log.error( error );

					process.exit( 1 );
				})
				.then( pages => {
					const elapsedTime = process.hrtime( startTime );

					Log.done(
						`${ pages.length > 0 ? `Successfully built ${ Style.yellow( pages[ 1 ].length ) } pages ` : `No pages have been build ` }` +
						`to ${ Style.yellow( SETTINGS.get().folder.site.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
						`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
					);

					// run watch on flag
					if( process.argv.includes('-w') || process.argv.includes('--watch') ) {
						Watch.start();
					}
			});
		}
		else {
			// run watch on flag
			if( process.argv.includes('-w') || process.argv.includes('--watch') ) {
				Watch.start();
			}
		}
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exit handler
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
process.on( 'exit', ExitHandler.bind( null, { withoutSpace: false } ) );              //on closing
process.on( 'SIGINT', ExitHandler.bind( null, { withoutSpace: true } ) );             //on [ctrl] + [c]
process.on( 'uncaughtException', ExitHandler.bind( null, { withoutSpace: false } ) ); //on uncaught exceptions
