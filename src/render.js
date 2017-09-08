/***************************************************************************************************************************************************************
 *
 * Render partials or even whole pages
 *
 * RenderReact     - Render a react component to string
 * RequireBabelfy  - Require from a string and babelfy the content first
 * RenderFile      - Render a file to HTML
 * IteratePartials - Iterate frontmatter and look for partials to render
 * RenderPartial   - Render a partial to HTML from the string inside frontmatter
 * RenderAllPages  - Render all pages in the content folder
 * PreRender       - Pre-render all pages to populate all helpers
 * RenderAssets    - Render assets folder
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
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile, CreateFile, CreateDir, RemoveDir, CopyFiles } from './files';
import { ParseContent, ParseMD } from './parse';
import { GetContent, GetLayout } from './site';
import { SETTINGS } from './settings.js';
import { Layouts, Watch } from './watch';
import { Log, Style } from './helper';
import { Progress } from './progress';
import { Slug } from './helper.js';
import { Pages } from './pages';
import { Store } from './store';
import { Nav } from './nav';

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

	try {
		// resolving relative dependencies
		let presetES2015 = Path.normalize(`${ __dirname }/../node_modules/babel-preset-es2015`);
		let presetStage0 = Path.normalize(`${ __dirname }/../node_modules/babel-preset-stage-0`);
		let presetReact = Path.normalize(`${ __dirname }/../node_modules/babel-preset-react`);
		let pluginSyntax = Path.normalize(`${ __dirname }/../node_modules/babel-plugin-syntax-dynamic-import`);
		let pluginImport = Path.normalize(`${ __dirname }/../node_modules/babel-plugin-import-redirect`);
		let propTypes = Path.normalize(`${ __dirname }/../node_modules/prop-types`);
		let react = Path.normalize(`${ __dirname }/../node_modules/react`);

		if( !Fs.existsSync( presetES2015 ) ) { // looks like it was installed locally
			presetES2015 = Path.normalize(`${ __dirname }/../../babel-preset-es2015`);
			presetStage0 = Path.normalize(`${ __dirname }/../../babel-preset-stage-0`);
			presetReact = Path.normalize(`${ __dirname }/../../babel-preset-react`);
			pluginSyntax = Path.normalize(`${ __dirname }/../../babel-plugin-syntax-dynamic-import`);
			pluginImport = Path.normalize(`${ __dirname }/../../babel-plugin-import-redirect`);
			propTypes = Path.normalize(`${ __dirname }/../../prop-types`);
			react = Path.normalize(`${ __dirname }/../../react`);
		}

		// babelfy components
		// we have to keep the presets and plugins close as we want to support and even encourage global installs
		const registerObj = {
			presets: [
				presetES2015,
				presetStage0,
				presetReact,
			],
			cache: !Watch.running, // we don’t need to cache during watch
		};

		// optional we redirect import statements for react to our local node_module folder
		// so react doesn’t have to be installed separately on globally installed cuttlebelle
		if( SETTINGS.get().site.redirectReact ) {
			registerObj.plugins = [
				pluginSyntax,
				[
					pluginImport,
					{
						redirect: {
							react: react,
							"prop-types": propTypes,
						},
						suppressResolveWarning: true,
					},
				],
			];
		}

		let component;
		if( source !== '' ) { // require from string
			component = RequireBabelfy( source ).default;
		}
		else {                // require from file
			require('babel-register')( registerObj );

			component = require( componentPath ).default;
		}

		return ReactDOMServer.renderToStaticMarkup( React.createElement( component, props ) );
	}
	catch( error ) {
		Log.error(`The react component ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.code, '' ) ) } had trouble rendering:`);
		Log.error( error );

		if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if the render fails in production
			process.exit( 1 );
		}

		return '';
	}
}


/**
 * Require from a string and babelfy the content first
 *
 * @param  {string} source - The source code to be babelfied and required
 *
 * @return {object}        - The require object
 */
export const RequireBabelfy = ( source ) => {

	const registerObj = {
		presets: [
			'babel-preset-es2015',
			'babel-preset-stage-0',
			'babel-preset-react',
		],
	};

	const transpiledSource = require("babel-core").transform( source, registerObj );

	return RequireFromString( transpiledSource.code );
}


/**
 * Render a file to HTML
 *
 * @param  {string} file     - The path to the file to be rendered
 * @param  {string} parent   - The path to the parent file, optional, default: ''
 * @param  {number} iterator - An iterator so we can generate unique IDs, default 0
 *
 * @return {promise object}  - The HTML content of the page
 */
export const RenderFile = ( file, parent = '', iterator = 0 ) => {
	Log.verbose(`Rendering file ${ Style.yellow( file ) }`);

	const _isIndex = Path.extname( file ) === '.yml';
	iterator ++;

	return new Promise( ( resolve, reject ) => {
		// So apparently getting the index pages from the cached object is slower than going to disk... mh
		// const allIndexs = [];

		// // let’s check if we have a cached version of this file
		// if( _isIndex && typeof Pages.get()[ Path.dirname( file ) ] === 'object' && !Watch.running ) {
		// 	Log.verbose(`Taking content of ${ Style.yellow( file ) } from cache`);

		// 	allIndexs.push(
		// 		Promise.resolve({
		// 			frontmatter: Pages.get()[ Path.dirname( file ) ],
		// 			body: '',
		// 		})
		// 	);
		// }
		// else {
		// 	Log.verbose(`Taking content of ${ Style.yellow( file ) } from file`);

		// 	const content = Path.normalize(`${ SETTINGS.get().folder.content }/${ file }`);

		// 	allIndexs.push(
		// 		ReadFile( content )
		// 			.catch( error => reject( error ) )
		// 			.then( body => ParseContent( body, file ) )
		// 	);
		// }

		// Promise.all( allIndexs )
		const content = Path.normalize(`${ SETTINGS.get().folder.content }/${ file }`);
		ReadFile( content )
			.catch( error => reject( error ) )
			.then( body => {
				let parsedBody = ParseContent( body, file );
				// let parsedBody = body[ 0 ];
				const ID = parent.length > 0 ? Path.dirname( parent ) : Path.dirname( file ); // the ID of this page is the folder in which parent exists
				const allPartials = [];

				if( _isIndex ) {
					Pages.inject( ID, parsedBody.frontmatter ); // we inject the frontmatter early so partials have access to it

					allPartials.push(
						IteratePartials( parsedBody.frontmatter, Path.normalize(`${ SETTINGS.get().folder.content }/${ file }`), iterator )
							.catch( error => {
								Log.error(`Generating page failed in ${ Style.yellow( file ) }`)
								reject( error );
							})
					);
				}
				else {
					allPartials.push( Promise.resolve( parsedBody.frontmatter ) );
				}

				Promise.all( allPartials )
					.catch( error => reject( error ) )
					.then( frontmatter => {
						parsedBody.frontmatter = frontmatter[ 0 ] ? frontmatter[ 0 ] : {}; // we only got one promise to resolve

						// set the default layout
						if( _isIndex ) {
							parsedBody.frontmatter.layout = parsedBody.frontmatter.layout || SETTINGS.get().layouts.page;
						}
						else {
							parsedBody.frontmatter.layout = parsedBody.frontmatter.layout || SETTINGS.get().layouts.partial;
						}

						// keeping track of all pages per layout will make the watch better
						Layouts.set( ID, parsedBody.frontmatter.layout );

						// to get the parents we just look at the path
						const parents = ID.split('/').map( ( item, i ) => {
							return ID.split('/').splice( 0, ID.split('/').length - i ).join('/');
						}).reverse();

						// and off we go into the react render machine
						let pageHTML = RenderReact(
							Path.normalize(`${ SETTINGS.get().folder.code }/${ parsedBody.frontmatter.layout }`),
							{
								_ID: ID,
								_parents: parents,
								_store: Store.get(),
								_storeSet: Store.set,
								_pages: Pages.get(),
								_nav: Nav.get(),
								_parseMD: ( markdown ) => <div key={`${ ID }-${ iterator }-md`} dangerouslySetInnerHTML={ { __html: ParseMD( markdown ) } } />,
								_relativeURL: ( URL, ID ) => {
									if( ID === SETTINGS.get().folder.homepage ) {
										ID = '';
									}

									return Path.relative(`${ SETTINGS.get().site.root }${ ID }`, URL);
								},
								_body: <div key={`${ ID }-${ iterator }`} dangerouslySetInnerHTML={ { __html: parsedBody.body } } />,
								...parsedBody.frontmatter
							}
						);

						// An index file will be written to disk
						if( _isIndex ) {
							// prefix our content with a doctype
							pageHTML = SETTINGS.get().site.doctype + pageHTML;

							const newPath = Path.normalize(`${ SETTINGS.get().folder.site }/${ ID === SETTINGS.get().folder.homepage ? '' : ID }/index.html`);
							CreateFile( newPath, pageHTML )
								.catch( error => reject( error ) )
								.then( () => resolve( newPath ) );

							Progress.tick();
						}
						// but a partial will be returned as HTML string
						else {
							resolve( pageHTML );
						}
				});
		});
	});
};


/**
 * Iterate frontmatter and look for partials to render
 *
 * @param  {object}  object   - The frontmatter object
 * @param  {string}  file     - The file path we got the frontmatter from
 * @param  {integer} iterator - An iterator so we can generate unique ID keys
 *
 * @return {promise object}   - The converted frontmatter now with partials replaced with their content
 */
export const IteratePartials = ( object, file, iterator = 0 ) => {
	Log.verbose(`Rendering all partials ${ Style.yellow( JSON.stringify( object ) ) }`);

	return new Promise( ( resolve, reject ) => {
		const allPartials = [];
		let tree;

		try {
			tree = Traverse( object );                 // we have to convert the deep object into a tree
		}
		catch( error ) {
			Log.error(`Traversing frontmatter failed in ${ Style.yellow( file ) }`)
			reject( error );
		}

		tree.map( function( partial ) {                    // so we can walk through the leaves and check for partial string
			if( this.isLeaf && typeof partial === 'string' ) {
				iterator ++;

				allPartials.push(
					RenderPartial( partial, file, this.path, iterator )
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
 * @param  {array}   path     - The path to the deep object structure of the frontmatter
 * @param  {integer} iterator - An iterator so we can generate unique ID keys
 *
 * @return {promise object}   - An object with the path and the rendered HTML react object, format: { path, partial }
 */
export const RenderPartial = ( partial, file, path, iterator = 0 ) => {
	Log.verbose(`Testing if we can render ${ Style.yellow( partial ) } as partial`);

	return new Promise( ( resolve, reject ) => {

		let cwd = Path.dirname( file );                                     // we assume relative links
		if( partial.startsWith('/') ) {                                     // unless the path starts with a slash
			cwd = SETTINGS.get().folder.content;
		}
		const partialPath = Path.normalize(`${ cwd }/${ partial }`);

		if( partial.endsWith('.md') && Fs.existsSync( partialPath ) ) {     // only if the string ends with ".md" and the corresponding file exists
			Log.verbose(`Partial ${ Style.yellow( partial ) } found`);

			RenderFile( partialPath.replace( SETTINGS.get().folder.content, '' ), file.replace( SETTINGS.get().folder.content, '' ), iterator )
				.catch( error => {
					Log.error(`Generating partial failed in ${ Style.yellow( partial ) }`)
					reject( error );
				})
				.then( HTML => {
					const ID = `cuttlebelleID${ Slug( partial ) }-${ iterator }`; // We generate a unique ID for react

					Log.verbose(`Rendering partial ${ Style.yellow( partial ) } complete with ID ${ Style.yellow( ID ) }`);

					resolve({                                                     // to resolve we need to keep track of the path of where this partial was mentioned
						path: path,
						partial: <div key={ ID } dangerouslySetInnerHTML={ { __html: HTML } } />,
					});
			});
		}
		else {
			resolve( partial );                                               // looks like the string wasn’t a partial so we just return it unchanged
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

			content.forEach( page => {
				allPages.push(
					RenderFile(`${ page }/${ SETTINGS.get().folder.index }.yml`)
				);
			});

			Promise.all( allPages )
				.catch( error => {
					reject( error );
				})
				.then( pages => resolve( pages ) );
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
