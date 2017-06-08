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
const Render = require('./render.js');
const RenderAllPages = Render.RenderAllPages;

const Watch = require('./watch.js').Watch;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Helper = require('./helper.js');
const ConvertHrtime = Helper.ConvertHrtime;
const ExitHandler = Helper.ExitHandler;
const SETTINGS = Helper.SETTINGS;
const Style = Helper.Style;
const Log = Helper.Log;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CLI options
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const pgk = require('../package.json');
Log.welcome(`Cuttlebelle v${ pgk.version }`);

const startTime = process.hrtime();

// verbose flag
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}

// the generate option
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
				`Successfully built ${ Style.yellow( pages.length ) } pages to ${ Style.yellow( SETTINGS.folder.site.replace( SETTINGS.folder.cwd, '' ) ) } ` +
				`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
			);
	});
}

// watch flag
if( process.argv.includes('-w') || process.argv.includes('--watch') ) {
	Watch.start();
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exit handler
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
process.on( 'exit', ExitHandler.bind( null, { withoutSpace: false } ) );              //on closing
process.on( 'SIGINT', ExitHandler.bind( null, { withoutSpace: true } ) );             //on [ctrl] + [c]
process.on( 'uncaughtException', ExitHandler.bind( null, { withoutSpace: false } ) ); //on uncaught exceptions
