/***************************************************************************************************************************************************************
 *
 * Watch all relevant files for changes
 *
 * browsersync  - The global browser sync instance
 * Watch        - Our file watcher
 * Watch.start  - Starting the watch
 * UpdateChange - React to changes depending on what happened in our watch
 * UpdateAll    - Build all pages
 * Layouts      - Keep track of all layouts
 * Layouts.get  - Get all layouts we have stored so far
 * Layouts.set  - Keep track of what pages use what react component
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderPage, RenderAllPages, RenderAssets } from './render';
import { GetLayout, GetContent, Pages } from './site';
import BS from 'browser-sync';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ConvertHrtime, Log, Style } from './helper';
import { SETTINGS } from './settings.js';


/**
 * The global browser sync instance
 *
 * @type {function}
 */
const browsersync = BS.create('cuttlebelle');


/**
 * Our file watcher
 *
 * @type {Object}
 */
export const Watch = {
	lastChange: new Date(),

	/**
	 * Starting the watch
	 */
	start: () => {
		browsersync.watch([ // watch all content and src files
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.yml`),
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.md`),
			Path.normalize(`${ SETTINGS.get().folder.src }/**/*.js`),
			Path.normalize(`${ SETTINGS.get().folder.assets }/**/*`),
		], { ignoreInitial: true })
		.on('change', path => {
			Log.info(`File has changed ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);

			const thisChange = new Date(); // double save detection
			if( ( thisChange - Watch.lastChange ) < 400 ) {
				Log.info(`${ Style.bold('Double save detected') }; regenerating all files`);

				UpdateChange( path, true );
			}
			else {
				Log.verbose(`Time since last change: ${ Style.yellow( ( thisChange - Watch.lastChange ) ) }`);

				UpdateChange( path );
			}

			Watch.lastChange = thisChange;
		})
		.on('add', path => {
			Log.info(`File has been added ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			UpdateChange( path );
		})
		.on('unlink', path => {
			Log.info(`File has ben deleted ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			UpdateChange( path, true );
		});

		Log.info(`Watching for changes`);

		browsersync.init({
			server: SETTINGS.get().folder.site,
			logLevel: 'silent',
			host: '127.0.0.1',
			port: 8080,
		});

	},
};


/**
 * React to changes depending on what happened in our watch
 *
 * @param  {array}   path          - All changes that have happened
 * @param  {boolean} _doEverything - Shall we just do all pages?
 */
export const UpdateChange = ( path, _doEverything = false ) => {
	const startTime = process.hrtime();

	const _isReact = path.startsWith( SETTINGS.get().folder.src );
	const _isAssets = path.startsWith( SETTINGS.get().folder.assets );

	// A page is being changed
	if( !_doEverything ) {
		if( _isAssets ) {
			Log.verbose(`Only doing assets changes`);
			// copy entire assets folder again
			RenderAssets(
				SETTINGS.get().folder.assets,
				Path.normalize(`${ SETTINGS.get().folder.site }/${ SETTINGS.get().folder.assets.replace( SETTINGS.get().folder.cwd, '' ) }`)
			)
				.catch( error => Log.error( error ) )
				.then( () => {

					const elapsedTime = process.hrtime( startTime );

					Log.done(
						`Successfully built ${ Style.yellow('assets') } folder to ${ Style.yellow( SETTINGS.get().folder.site.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
						`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
					);

					browsersync.reload();
			});
		}

		else if( !_isReact ) {
			Log.verbose(`Detected content changes`);

			const page = Path.dirname( path ).replace( SETTINGS.get().folder.content, '' );

			if( !Fs.existsSync( Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }`) ) ) {
				UpdateAll( startTime );
			}
			else {
				RenderPage( page )
					.catch( error => {
						Log.error(`An error occured while trying to generate ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
						Log.error( error );
					})
					.then( page => {
						const elapsedTime = process.hrtime( startTime );

						Log.done(
							`Successfully built ${ Style.yellow( page.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
							`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
						);

						browsersync.reload();
					}
				);
			}
		}
		// A react component is being changed
		else {
			Log.verbose(`Detected react changes`);

			const page = path.replace( SETTINGS.get().folder.src, '' ).replace( '.js', '' );

			Log.verbose(`Changes effected ${ Style.yellow( JSON.stringify( Layouts.get()[ page ] ) ) }`);

			const layout = GetLayout();

			RenderAllPages( Layouts.get()[ page ], layout )
				.catch( error => {
					Log.error(`An error occured while trying to generate all pages`);
					Log.error( error );
				})
				.then( pages => {
					const elapsedTime = process.hrtime( startTime );

					Log.done(
						`Successfully built ${ Style.yellow( pages.length ) } pages to ${ Style.yellow( SETTINGS.get().folder.site.replace( SETTINGS.get().folder.cwd, '' ) ) } ` +
						`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
					);

					browsersync.reload();
				}
			);
		}
	}
	// re-generating all pages
	else {
		UpdateAll( startTime );
	}
};


/**
 * Build all pages
 *
 * @param  {array} startTime - The Hrtime array
 */
const UpdateAll = ( startTime ) => {
	// Getting all pages
	const content = GetContent();
	Log.verbose(`Found following content: ${ Style.yellow( JSON.stringify( content ) ) }`);

	// Getting all layout components
	const layout = GetLayout();
	Log.verbose(`Found following layout:\n${ Style.yellow( JSON.stringify( layout ) ) }`);

	// Get all front matter from all pages and put them into a global var
	Pages
		.setAll( content )
		.catch( error => {
			Log.error(`Trying to initilize the pages failed.`);
			Log.error( error );

			process.exit( 1 );
		})
		.then( () => {

			RenderAllPages( content, layout )
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

					browsersync.reload();
				}
			);
		}
	);
};


/**
 * Keep track of all layouts
 *
 * @type {Object}
 */
export const Layouts = {
	/**
	 * The global layouts object
	 *
	 * @type {Object}
	 */
	all: {},


	/**
	 * Get all layouts we have stored so far
	 *
	 * @return {object} - The layouts object
	 */
	get: () => {
		return Layouts.all;
	},


	/**
	 * Keep track of what pages use what react component
	 *
	 * @param  {string} page   - The name of the page
	 * @param  {string} layout - The name of the react component
	 */
	set: ( page, layout ) => {
		Log.verbose(`Keeping track of the page ${ Style.yellow( page ) } for layout ${ Style.yellow( layout ) }`);

		if( !Layouts.all[ layout ] ) {
			Layouts.all[ layout ] = [];
		}

		if( !Layouts.all[ layout ].includes( page ) ) {
			Layouts.all[ layout ].push( page );
		}
	},
};
