/***************************************************************************************************************************************************************
 *
 * Watch all relevant files for changes
 *
 * browsersync   - The global browser sync instance
 * Watch         - Our file watcher object
 * Watch.start   - Starting the watch
 * UpdateChange  - Triage changes the the appropriate functions
 * UpdateAssets  - Build assets folder
 * UpdateContent - Build from content pages/partials
 * UpdateReact   - Build from react components
 * UpdateAll     - Build all pages
 * Layouts       - Keep track of all layouts
 * Layouts.get   - Get all layouts we have stored so far
 * Layouts.set   - Keep track of what pages use what react component
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import BS from 'browser-sync';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { RenderFile, RenderAllPages, RenderAssets, PreRender } from './render';
import { ConvertHrtime, Log, Style } from './helper';
import { ReadFile, CreateFile } from './files';
import { GetLayout, GetContent } from './site';
import { SETTINGS } from './settings.js';
import { Progress } from './progress';
import { Pages } from './pages';
import { Nav } from './nav';


/**
 * The global browser sync instance
 *
 * @type {function}
 */
const browsersync = BS.create('cuttlebelle');


/**
 * Our file watcher object
 *
 * @type {Object}
 */
export const Watch = {
	lastChange: new Date(),
	running: false,

	/**
	 * Starting the watch
	 */
	start: () => {
		browsersync.watch([ // watch all content and src files
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.yml`),
			Path.normalize(`${ SETTINGS.get().folder.content }/**/*.md`),
			Path.normalize(`${ SETTINGS.get().folder.code }/**/*.js`),
			Path.normalize(`${ SETTINGS.get().folder.assets }/**/*`),
		], {
			ignoreInitial: true,
		})
		.on('change', path => {
			const thisChange = new Date(); // double save detection

			if( ( thisChange - Watch.lastChange ) < SETTINGS.get().site.watchTimeout ) {
				Log.info(`${ Style.bold('Double save detected') }; regenerating all files`);
				DebouncedWatch( path, true );
			}
			else {
				Log.verbose(`Time since last change: ${ Style.yellow( ( thisChange - Watch.lastChange ) ) }`);

				Log.info(`File has changed ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
				DebouncedWatch( path, false );
			}

			Watch.lastChange = thisChange;
		})
		.on('add', path => {
			Log.info(`File has been added ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			DebouncedWatch( path, true );
		})
		.on('unlink', path => {
			Log.info(`File has ben deleted ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			DebouncedWatch( path, true );
		});

		Watch.running = true;

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
 * Debounce watch as simple as possible
 *
 * @param  {string}  path      - The path of the changed file
 * @param  {boolean} _buildAll - Whether or not to build everything
 */
let timeout;
let buildAll = false;
let history = [];
export const DebouncedWatch = ( path, _buildAll ) => {
	history.push( path ); // let’s keep a record of the changes

	if( _buildAll ) {
		buildAll = true;    // remember if we ever wanted to rebuild everything and stick with that
	}

	if( timeout ) {
		clearTimeout( timeout );
		timeout = null;
	}

	timeout = setTimeout( () => {
		UpdateChange( path, history, buildAll );
		buildAll = false; // now let’s go back to where we were before
		history = [];
	}, SETTINGS.get().site.watchTimeout );
};


/**
 * Triage changes the the appropriate functions
 *
 * @param  {array}   path          - The path of the change
 * @param  {array}   history       - All changes that have happened since last debounce
 * @param  {boolean} _doEverything - Shall we just do all pages?
 */
export const UpdateChange = ( path, history, _doEverything = false ) => {
	const startTime = process.hrtime();

	const _isReact = path.startsWith( SETTINGS.get().folder.code );
	const _isAssets = path.startsWith( SETTINGS.get().folder.assets );

	Progress.done = 0;

	// A page is being changed
	if( !_doEverything ) {

		Progress.set( 1 );

		if( _isAssets ) {
			UpdateAssets( startTime );
		}
		else if( !_isReact ) {
			Log.verbose(`Detected content changes`);

			const page = Path.dirname( path ).replace( SETTINGS.get().folder.content, '' );

			if( !Fs.existsSync( Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }.yml`) ) ) {
				UpdateAll( startTime );
			}
			else {
				UpdateContent( startTime, path, page );
			}
		}
		// A react component is being changed
		else {
			// delete require.cache[ require.resolve('babel-register') ];
			process.env.BABEL_DISABLE_CACHE = 1;
			delete require.cache[ require.resolve( path ) ]; // cache busting

			UpdateReact( startTime, path );
		}
	}
	// double save
	else {
		if(
			history.find( item => item.startsWith( SETTINGS.get().folder.code ) ) !== undefined ||
			history.find( item => item.startsWith( SETTINGS.get().folder.content ) ) !== undefined
		) {
			UpdateAll( startTime ); // re-generating all pages
		}

		if( history.find( item => item.startsWith( SETTINGS.get().folder.assets ) ) !== undefined ) {
			UpdateAssets( startTime ); // re-generating assets
		}
	}
};


/**
 * Build assets folder
 *
 * @param  {array} startTime - The Hrtime array
 */
export const UpdateAssets = ( startTime ) => {
	Log.verbose(`Only doing assets changes`);

	let assetsLocation = SETTINGS.get().folder.assets.split( Path.sep );
	assetsLocation = Path.normalize(`${ SETTINGS.get().folder.site }/${ assetsLocation[ assetsLocation.length - 2 ] }/`);

	// copy entire assets folder again
	RenderAssets(
		SETTINGS.get().folder.assets,
		assetsLocation
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
};


/**
 * Build from content pages/partials
 *
 * @param  {array}  startTime - The Hrtime array
 * @param  {string} path      - The path of the changed file
 * @param  {string} page      - The path to the page attached to the changed content
 */
export const UpdateContent = ( startTime, path, page ) => {
	Log.verbose(`Only doing content changes`);

	const filePath = Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }.yml`);

	ReadFile( filePath )
		.catch( error => {
			Log.error(`An error occured while trying to generate ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }`);
			Log.error( error );
		})
		.then( content => RenderFile( content, filePath.replace( SETTINGS.get().folder.content, '' ) ) )
		.then( HTML => {
				const newPath = Path.normalize(`${ SETTINGS.get().folder.site }/${ page === SETTINGS.get().folder.homepage ? '' : page }/index.html`);

				CreateFile( newPath, HTML ).catch( error => reject( error ) );

				Progress.tick();

				return newPath.replace( SETTINGS.get().folder.cwd, '' );
		})
		.then( page => {
			const elapsedTime = process.hrtime( startTime );

			Log.done(
				`Successfully built ${ Style.yellow( page ) } ` +
				`in ${ Style.yellow(`${ ConvertHrtime( elapsedTime ) }s`) }`
			);

			browsersync.reload();
		}
	);
};


/**
 * Build from react components
 *
 * @param  {array}  startTime - The Hrtime array
 * @param  {string} path      - The path of the changed file
 */
export const UpdateReact = ( startTime, path ) => {
	Log.verbose(`Only doing react changes`);

	const page = path.replace( SETTINGS.get().folder.code, '' ).replace( '.js', '' );

	Log.verbose(`Changes effected ${ Style.yellow( JSON.stringify( Layouts.get()[ page ] ) ) }`);

	const layout = GetLayout();

	if( Layouts.get()[ page ] ) { // render only if we have something to render

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
	else {
		Log.info(`No pages were found to be attached to ${ Style.yellow( path.replace( SETTINGS.get().folder.cwd, '' ) ) }.`);
		Log.info(`Consider a double-save to render all pages.`);
	}
};


/**
 * Build all pages
 *
 * @param  {array} startTime - The Hrtime array
 */
export const UpdateAll = ( startTime ) => {

	// remove babel register components from require cache
	const allComponents = Object.keys( require.cache ).filter( ( key ) => key.startsWith( SETTINGS.get().folder.code ) );

	allComponents.map( ( component ) => {
		delete require.cache[ component ]; // cache busting
	});

	PreRender()
		.catch( error => {
			Log.error(`Trying to initilize the pages failed.`);
			Log.error( error );

			process.exit( 1 );
		})
		.then( ({ content, layout }) => {

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
