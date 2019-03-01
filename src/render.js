/***************************************************************************************************************************************************************
 *
 * Render partials or even whole pages
 *
 * RelativeURL     - Resolve two paths relative to each other
 * RenderReact     - Render a react component to string
 * RenderFile      - Render a file to HTML
 * FindPartial     - Iterate frontmatter and look for partials to render
 * RenderPartial   - Render a partial to HTML from the string inside frontmatter
 * RenderAllPages  - Render all pages in the content folder
 * PreRender       - Pre-render all pages to populate all helpers
 * RenderAssets    - Render assets folder
 *
 *
 *      input
 *        ║                 ┌───────────────┐
 *        ║     ┌──────────▶│  FindPartial  │
 *        ║     │           └───────────────┘
 *        ▼     │                 loop
 *      ┌───────────────┐           ○
 *      │  RenderFile   │           │
 *      └───────────────┘           │
 *          │   ▲                   │
 *          │   │                   ▼
 *          │   │           ┌───────────────┐
 *          │   └───────────│ RenderPartial │
 *          │               └───────────────┘
 *          ▼
 *      ┌───────────────┐
 *      │  RenderReact  │
 *      └───────────────┘
 *              ║
 *              ║
 *              ▼
 *            output
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import RequireFromString from 'require-from-string';
import ReactDOMServer from 'react-dom/server';
import Traverse from 'traverse';
import React from 'react';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile, CreateFile, CreateDir, RemoveDir, CopyFiles } from './files';
import { ParseContent, ParseMD, ParseYaml, ParseHTML } from './parse';
import { GetContent, GetLayout } from './site';
import { Log, Style } from './helper';
import { Layouts, Watch } from './watch';
import { SETTINGS } from './settings';
import { Progress } from './progress';
import { Pages } from './pages';
import { Store } from './store';
import { Slug } from './helper';
import { Path } from './path';
import { Nav } from './nav';


/**
 * Resolve two paths relative to each other
 *
 * @param  {string} URL - The URL you want to link to
 * @param  {string} ID  - The ID of the page you are on
 *
 * @return {string}     - A relative path to URL from ID
 */
export const RelativeURL = ( URL, ID ) => {
	if( ID === SETTINGS.get().folder.homepage ) {
		ID = '';
	}

	const relative = Path.posix.relative( `${ SETTINGS.get().site.root }${ ID }`, `${ SETTINGS.get().site.root }${ URL }` );

	return relative === '' ? '.' : relative;
}


/**
 * Render a react component to string
 *
 * @param  {string} componentPath - The path to the react component
 * @param  {object} props         - The props
 * @param  {object} source        - An optional string to compile from a string rather than from a file, optional
 *
 * @return {string}               - The static markup of the component
 */
export const RenderReact = ( componentPath, props, source = '' ) => {
	Log.verbose(`Rendering react component ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.code, '' ) ) }`);

	// babelfy components
	// we have to keep the presets and plugins close as we want to support and even encourage global installs
	const registerObj = {
		presets: [
			require.resolve( '@babel/preset-react' ),
			[
				require.resolve( '@babel/preset-env' ),
				{
					targets: {
						node: 'current'
					}
				}
			]
		],
		plugins: [
			require.resolve( 'babel-plugin-transform-es2015-modules-commonjs' ),
			require.resolve( '@babel/plugin-proposal-object-rest-spread' ),
			[ require.resolve( '@babel/plugin-transform-runtime' ), { 'helpers': false } ],
		],
	};

	const redirectReact = [
		require.resolve( '@babel/plugin-syntax-dynamic-import' ),
		[
			require.resolve( 'babel-plugin-import-redirect' ),
			{
				redirect: {
					react: require.resolve( 'react' ),
					'prop-types': require.resolve( 'prop-types' ),
				},
				suppressResolveWarning: true,
			},
		],
	];

	// optional we redirect import statements for react to our local node_module folder
	// so react doesn’t have to be installed separately on globally installed cuttlebelle
	if( SETTINGS.get().site.redirectReact || source !== '' ) {
		registerObj.plugins = [ ...registerObj.plugins, ...redirectReact ];
	}

	let component;

	try {
		if( source !== '' ) { // require from string
			registerObj.filename = Path.normalize(`${ __dirname }/cuttlebelle-temp-file`); // bug in babel https://github.com/yahoo/babel-plugin-react-intl/issues/156
			const transpiledSource = require('@babel/core').transformSync( source, registerObj );
			component = RequireFromString( transpiledSource.code ).default;
		}
		else {                // require from file
			registerObj.cache = !Watch.running; // we don’t need to cache during watch
			require('@babel/register')( registerObj );

			component = require( componentPath ).default;
		}
	}
	catch( error ) {
		Log.error(`Babel failed for ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.code, '' ) ) }:`);
		Log.error( error );
		Log.verbose( JSON.stringify( registerObj ) );

		if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if the render fails in production
			process.exit( 1 );
		}

		return '';
	}

	try {
		return ReactDOMServer.renderToStaticMarkup( React.createElement( component, props ) );
	}
	catch( error ) {
		Log.error(`The react component ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.code, '' ) ) } had trouble rendering:`);
		Log.error( error );
		Log.verbose( JSON.stringify( registerObj ) );

		if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if the render fails in production
			process.exit( 1 );
		}

		return '';
	}
}


/**
 * Render a file to HTML
 *
 * @param  {string} content  - The content of the file to be rendered
 * @param  {string} file     - The path to this file
 * @param  {string} parent   - The path to the parent file, optional, default: ''
 * @param  {array}  rendered - An array of all pages that have been through this render loop to detect circular dependencies, optional, default: []
 * @param  {number} iterator - An iterator so we can generate unique IDs, default 0
 *
 * @return {promise object}  - The HTML content of the page
 */
export const RenderFile = ( content, file, parent = '', rendered = [], iterator = 0 ) => {
	Log.verbose(`Rendering file ${ Style.yellow( file ) }`);

	if( parent === '' ) {
		parent = file;
	}

	iterator ++;

	if( rendered.includes( file ) ) {
		return Promise.reject(`A circular dependency (${ Style.yellow( file ) }) was detected in ${ Style.yellow( parent ) }`);
	}
	else {
		return new Promise( ( resolve, reject ) => {
			const ID = Path.normalize( parent.length > 0 ? Path.dirname( parent ) : Path.dirname( file ) ); // the ID of this page is the folder in which it exists

			// to get the parents we just look at the path
			let parents = ID.split('/').map( ( item, i ) => {
				return ID.split('/').splice( 0, ID.split('/').length - i ).join('/');
			});

			// we add the homepage to the parents root
			if( ID !== SETTINGS.get().folder.index ) {
				parents.push( SETTINGS.get().folder.index )
			}

			parents = parents.reverse(); // gotta have it the right way around

			// prepare some common props that will go into the custom markdown renderer and the react renderer
			const defaultProps = {
				_ID: ID,
				_self: file,
				_isDocs: false,
				_parents: parents,
				_storeSet: Store.set,
				_store: Store.get,
				_nav: Nav.get(),
				_relativeURL: RelativeURL,
				_parseYaml: ( yaml, file ) => ParseYaml( yaml, file ),
				_parseReact: ( component ) => {
					try {
						return ReactDOMServer.renderToStaticMarkup( component );
					}
					catch( error ) {
						Log.error(`An error occurred inside ${ Style.yellow( file ) } while running ${ Style.yellow('_renderReact') }`);
						Log.error( error );
					}
				},
				_globalProp: SETTINGS.get().site.globalProp || {},
			};

			// parsing out front matter for this file
			let parsedBody = ParseContent( content, file, { _pages: Pages.get(), ...defaultProps }, );

			rendered.push( file ); // keeping track of all files we render to avoid circular dependencies

			Pages.inject( ID, parsedBody.frontmatter ); // we inject the frontmatter early so partials have access to it

			process.nextTick(() =>
				FindPartial(
					parsedBody.frontmatter,
					Path.normalize(`${ SETTINGS.get().folder.content }/${ file }`),
					parent,
					rendered,
					iterator
				)
				.catch( error => {
					Log.error(`Generating page failed in ${ Style.yellow( file ) }`);
					reject( error );
				})
				.then( frontmatter => {
					parsedBody.frontmatter = frontmatter ? frontmatter : {}; // we only got one promise to resolve

					// set the default layout
					if( file.endsWith('.yml') ) {
						parsedBody.frontmatter.layout = parsedBody.frontmatter.layout || SETTINGS.get().layouts.page;
					}
					else {
						parsedBody.frontmatter.layout = parsedBody.frontmatter.layout || SETTINGS.get().layouts.partial;
					}

					// keeping track of all pages per layout will make the watch better
					Layouts.set( ID, parsedBody.frontmatter.layout );

					// and off we go into the react render machine
					let pageHTML = RenderReact(
						Path.normalize(`${ SETTINGS.get().folder.code }/${ parsedBody.frontmatter.layout }`),
						{
							_pages: Pages.get(),
							_parseMD: ( markdown, file, props = defaultProps ) => <cuttlebellesillywrapper key={`${ ID }-${ iterator }-md`} dangerouslySetInnerHTML={ {
								__html: ParseMD( markdown, file, props )
							} } />,
							_body: <cuttlebellesillywrapper key={`${ ID }-${ iterator }`} dangerouslySetInnerHTML={ { __html: parsedBody.body } } />,
							...defaultProps,
							...parsedBody.frontmatter
						}
					);

					resolve( pageHTML );
				})
			);
		});
	}
};


/**
 * Iterate frontmatter and look for partials to render
 *
 * @param  {object}  object   - The frontmatter object
 * @param  {string}  file     - The file path we got the frontmatter from
 * @param  {string}  parent   - The path to the parent file
 * @param  {array}   rendered - An array of all pages rendered so far
 * @param  {integer} iterator - An iterator so we can generate unique ID keys
 *
 * @return {promise object}   - The converted frontmatter now with partials replaced with their content
 */
export const FindPartial = ( object, file, parent, rendered, iterator = 0 ) => {
	Log.verbose(`Rendering all partials ${ Style.yellow( JSON.stringify( object ) ) }`);

	return new Promise( ( resolve, reject ) => {
		const allPartials = [];
		let tree;

		try {
			tree = Traverse( object );                       // we have to convert the deep object into a tree
		}
		catch( error ) {
			Log.error(`Traversing frontmatter failed in ${ Style.yellow( file ) }`)
			reject( error );
		}

		tree.map( function( partial ) {                    // so we can walk through the leaves and check for partial string
			if( this.isLeaf && typeof partial === 'string' ) {
				iterator ++;

				allPartials.push(
					RenderPartial(
						partial,
						file,
						parent,
						this.path,
						[ ...rendered ],
						iterator
					)
					.catch( error => {
						Log.error(`Render partial failed for ${ Style.yellow( partial ) }`)
						reject( error );
					})
				);
			}
		});

		Promise.all( allPartials )                         // after all partials have been rendered out
			.catch( error => reject( error ) )
			.then( frontmatter => {

				frontmatter.map( ( partial ) => {
					if( typeof partial === 'object' && partial.path ) {
						tree.set( partial.path, partial.partial ); // we replace the partial string with the partial content
					}
				});

				resolve( object );
		});
	});
}


/**
 * Render a partial to HTML from the string inside frontmatter
 *
 * @param  {string}  partial  - The partial string
 * @param  {string}  file     - The file path we got the frontmatter from
 * @param  {string}  parent   - The path to the parent file
 * @param  {array}   path     - The path to the deep object structure of the frontmatter
 * @param  {array}   rendered - An array of all pages rendered so far
 * @param  {integer} iterator - An iterator so we can generate unique ID keys
 *
 * @return {promise object}   - An object with the path and the rendered HTML react object, format: { path, partial }
 */
export const RenderPartial = ( partial, file, parent, path, rendered, iterator = 0 ) => {
	Log.verbose(`Testing if we can render ${ Style.yellow( partial ) } as partial`);

	return new Promise( ( resolve, reject ) => {

		let cwd = Path.dirname( file );                                 // we assume relative links
		if( partial.startsWith('/') ) {                                 // unless the path starts with a slash
			cwd = SETTINGS.get().folder.content;
		}
		const partialPath = Path.normalize(`${ cwd }/${ partial }`);

		if( partial.endsWith('.md') && Fs.existsSync( partialPath ) ) { // only if the string ends with ".md" and the corresponding file exists
			Log.verbose(`Partial ${ Style.yellow( partial ) } found`);

			const ID = partialPath.replace( SETTINGS.get().folder.content, '' )
			const filePath = Path.normalize(`${ SETTINGS.get().folder.content }/${ ID }`);

			process.nextTick(() =>
				ReadFile( filePath )
					.catch( error => {
						Log.error(`Generating partial failed in ${ Style.yellow( partial ) }`)
						reject( error );
					})
					.then( content => RenderFile(
							content,
							filePath.replace( SETTINGS.get().folder.content, '' ),
							parent,
							rendered,
							iterator
						)
						.catch( reason => reject( reason ) )
					)
					.then( HTML => {
						const ID = `cuttlebelleID${ Slug( partial ) }-${ iterator }`; // We generate a unique ID for react

						Log.verbose(`Rendering partial ${ Style.yellow( partial ) } complete with ID ${ Style.yellow( ID ) }`);

						resolve({                                                     // to resolve we need to keep track of the path of where this partial was mentioned
							path: path,
							partial: <cuttlebellesillywrapper key={ ID } dangerouslySetInnerHTML={ { __html: HTML } } />,
						});
				})
			);
		}
		else {
			resolve( partial );                                                 // looks like the string wasn’t a partial so we just return it unchanged
		}
	});
};


/**
 * Render all pages in the content folder
 *
 * @param  {array}  content - An array of all pages
 * @param  {array}  layout  - An array of all layout components
 *
 * @return {promise object} - The array of all pages
 */
export const RenderAllPages = ( content = [], layout = [] ) => {
	Log.verbose(`Rendering all pages:\n${ Style.yellow( JSON.stringify( content ) ) }`);

	if( content ) {
		RemoveDir([ ...content ]);

		return new Promise( ( resolve, reject ) => {
			const allPages = [];

			content.forEach( page => process.nextTick( () => {
				const filePath = Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }.yml`);

				allPages.push(
					ReadFile( filePath )
						.catch( error => reject( error ) )
						.then( content => RenderFile( content, filePath.replace( SETTINGS.get().folder.content, '' ) ) )
						.then( HTML => {
							const newPath = Path.normalize(`${ SETTINGS.get().folder.site }/${ page === SETTINGS.get().folder.homepage ? '' : page }/index.html`);

							CreateFile( newPath, ParseHTML( SETTINGS.get().site.doctype + HTML ) )
								.catch( error => reject( error ) );

							Progress.tick();
					})
				);
			}));

			process.nextTick( () =>
				Promise
					.all( allPages )
					.catch( error => {
						reject( error );
					})
					.then( pages => resolve( pages ) )
			);
		});
	}
	else {
		return Promise.resolve([]);
	}
};


/**
 * Pre-render all pages to populate all helpers
 *
 * @return {Promise object} - An object of content and layout arrays, format: { content: [], layout: {} }
 */
export const PreRender = () => {
	// Getting all pages
	const content = GetContent();
	Log.verbose(`Found following content: ${ Style.yellow( JSON.stringify( content ) ) }`);

	// Setting nav globally
	Nav.set( content );

	// Getting all layout components
	const layout = GetLayout();
	Log.verbose(`Found following layout:\n${ Style.yellow( JSON.stringify( layout ) ) }`);

	if( content === undefined ) {
		return Promise.resolve( { content: [], layout: [] } );
	}
	else {
		// Setting how many pages we will have to go through
		Progress.set( content.length );

		return new Promise( ( resolve, reject ) => {
			// Get all front matter from all pages and put them into a global var
			Pages
				.setAll( content )
				.catch( error => reject( error ) )
				.then( () => resolve({
					content,
					layout,
				}) );
		});
	}
};


/**
 * Render assets folder
 *
 * @param  {string} source      - The source path
 * @param  {string} destination - The destination path
 *
 * @return {promise object}     - Resolves when finished
 */
export const RenderAssets = ( source, destination ) => {
	return new Promise( ( resolve, reject ) => {
		if (!Fs.existsSync(destination))
			CreateDir( destination );

		CopyFiles( source, destination )
			.catch( error => {
				Log.error(`Error encountered while atempting to copy files from ${ Style.yellow( source ) } to ${ Style.yellow( destination ) }`);
				Log.error( error );

				reject( error );
			})
			.then( finished => {
				resolve( finished );
		});
	});
};
