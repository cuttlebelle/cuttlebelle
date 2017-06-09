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
// Babel
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
require('babel-register')({
	presets: [
		'es2015',
		'stage-0',
		'react',
	],
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderAllPages } from './render.js';
import { SETTINGS } from './settings.js';
import { Watch } from './watch.js';
import Size from 'window-size';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ConvertHrtime, ExitHandler, Style, Log } from './helper.js';


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
${ padding }  ${ Style.bold(`watch`) }       - Start to watch the content and source folder for changes
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-w`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --watch`) ) }

${ padding }  ${ Style.bold(`no-generate`) } - Disable generation of all pages, best in combination with watch.
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-n`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --no-generate --watch`) ) }

${ padding }  ${ Style.bold(`verbose`) }     - Enable silly verbose mode
${ padding }              - Shortcut: ${ Style.yellow( Style.bold(`-v`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --verbose`) ) }
`);
	Log.space();

	process.exit( 0 );
}


Log.welcome(`Cuttlebelle v${ pkg.version }`);


// keep track of execution time
const startTime = process.hrtime();


// verbose flag
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}


// merging default settings with package.json
const loacalPkg = require( Path.normalize(`${ process.cwd() }/package.json`) );
SETTINGS.set( loacalPkg.cuttlebelle );


// generate all pages unless it’s disabled
if( !process.argv.includes('-n') && !process.argv.includes('--no-generate') ) {
	Log.info(`Generating pages`);

	RenderAllPages()
		.catch( error => {
			Log.error(`Generating pages failed :(`);
			Log.error( error );

			process.exit( 1 );
		})
		.then( pages => {
			const elapsedTime = process.hrtime( startTime );

			Log.done(
				`${ pages.length > 0 ? `Successfully built ${ Style.yellow( pages.length ) } pages ` : `No pages have been build ` }` +
				`to ${ Style.yellow( SETTINGS.get().folder.site.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
				`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
			);
	});
}


// run watch on flag
if( process.argv.includes('-w') || process.argv.includes('--watch') ) {
	Watch.start();
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exit handler
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
process.on( 'exit', ExitHandler.bind( null, { withoutSpace: false } ) );              //on closing
process.on( 'SIGINT', ExitHandler.bind( null, { withoutSpace: true } ) );             //on [ctrl] + [c]
process.on( 'uncaughtException', ExitHandler.bind( null, { withoutSpace: false } ) ); //on uncaught exceptions
