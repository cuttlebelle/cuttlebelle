/***************************************************************************************************************************************************************
 *
 * Watch all relevant files for changes
 *
 * Watch        - Our file watcher
 * Watch.start  - Starting the watch
 * Watch.stop   - Stopping the watch
 * UpdateChange - React to changes depending on what happened in our watch
 * Layouts      - Keep track of all layouts
 * Layouts.get  - Get all layouts we have stored so far
 * Layouts.set  - Keep track of what pages use what react component
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderPage, RenderAllPages } from './render';
import { GetLayout, GetContent, Pages } from './site';
import Chokidar from 'chokidar';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ConvertHrtime, Log, Style } from './helper';
import { SETTINGS } from './settings.js';


/**
 * Our file watcher
 *
 * @type {Object}
 */
export const Watch = {
	watcher: {},
	lastChange: new Date(),

	/**
	 * Starting the watch
	 */
	start: () => {
		Watch.watcher = Chokidar.watch([ // watch all content and src files
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.yml`),
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.md`),
			Path.normalize(`${ SETTINGS.get().folder.src }/**/*.js`),
		], {
			ignoreInitial: true,
		});

		Log.info(`Watching for changes`);

		Watch.watcher.on('change', path => {
			Log.info(`File has changed ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);

			const thisChange = new Date(); // double save detection
			if( ( thisChange - Watch.lastChange ) < 400 ) {
				Log.info(`${ Style.bold('Double save detected') }; regenerating all files`);

				UpdateChange( path, true );
			}
			else {
				UpdateChange( path );
			}

			Watch.lastChange = thisChange;
		});

		Watch.watcher.on('add', path => {
			Log.info(`File has been added ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			UpdateChange( path );
		});

		Watch.watcher.on('unlink', path => {
			Log.info(`File has ben deleted ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			UpdateChange( path, true );
		});
	},

	/**
	 * Stopping the watch
	 */
	stop: () => {
		Watch.watcher.close();
	}
};


/**
 * React to changes depending on what happened in our watch
 *
 * @param  {array}   path          - All changes that have happened
 * @param  {boolean} _doEverything - Shall we just do all pages?
 */
export const UpdateChange = ( path, _doEverything = false ) => {
	const startTime = process.hrtime();

	let _isReact = path.startsWith( SETTINGS.get().folder.src );

	// A page is being changed
	if( !_doEverything ) {
		if( !_isReact ) {
			const page = Path.dirname( path ).replace( SETTINGS.get().folder.content, '' );

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
				}
			);
		}
		// A react component is being changed
		else {
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
				}
			);
		}
	}
	// Something has been deleted
	else {
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
					}
				);
			}
		);
	}
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
