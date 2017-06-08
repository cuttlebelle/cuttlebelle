/***************************************************************************************************************************************************************
 *
 * Watch all relevant files for changes
 *
 * Watch - Our file watcher
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderPage, RenderAllPages } from './render';
import Chokidar from 'chokidar';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS, LAYOUTS, ConvertHrtime, Log, Style } from './helper';


/**
 * Our file watcher
 *
 * @type {Object}
 */
export const Watch = {
	watcher: {},

	/**
	 * Starting the watch
	 */
	start: () => {
		Watch.watcher = Chokidar.watch([ // watch all content and src files
			Path.normalize(`${ SETTINGS.folder.content }/**/*.yml`),
			Path.normalize(`${ SETTINGS.folder.content }/**/*.md`),
			Path.normalize(`${ SETTINGS.folder.src }/**/*.js`),
		], {});

		Log.info(`Watching for changes`);

		Watch.watcher.on('change', path => {
			const startTime = process.hrtime();

			Log.info(`File has changed ${ Style.yellow( path.replace( SETTINGS.folder.cwd, '' ) ) }`);

			let _isReact = path.startsWith( SETTINGS.folder.src );

			if( !_isReact ) {
				const page = Path.dirname( path ).replace( SETTINGS.folder.content, '' );

				RenderPage( page )
					.catch( error => {
						Log.error(`An error occured while trying to generate ${ Style.yellow( path.replace( SETTINGS.folder.cwd, '' ) ) }`);
						Log.error( error );
					})
					.then( page => {
						const elapsedTime = process.hrtime( startTime );

						Log.done(
							`Successfully built ${ Style.yellow( page.replace( SETTINGS.folder.cwd, '' ) ) } ` +
							`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
						);
					}
				);
			}
			else {
				const page = path.replace( SETTINGS.folder.src, '' ).replace( '.js', '' );

				RenderAllPages() // @TODO keep track of what layout is in what page and only render those via LAYOUTS[ page ]
					.catch( error => {
						Log.error(`An error occured while trying to generate all pages`);
						Log.error( error );
					})
					.then( pages => {
						const elapsedTime = process.hrtime( startTime );

						Log.done(
							`Successfully built ${ Style.yellow( pages.length ) } pages to ${ Style.yellow( SETTINGS.folder.site.replace( SETTINGS.folder.cwd, '' ) ) } ` +
							`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
						);
					});
			}
		});
	},

	/**
	 * Stopping the watch
	 */
	stop: () => {
		Watch.watcher.close();
	}
};


export const KeepTrack = ( page, layout ) => {
	Log.verbose(`Keeping track of the page ${ Style.yellow( page ) } for layout ${ Style.yellow( layout ) }`);

	if( !LAYOUTS[ layout ] ) {
		LAYOUTS[ layout ] = [];
	}

	if( !LAYOUTS[ layout ].includes( page ) ) {
		LAYOUTS[ layout ].push( page );
	}
};
