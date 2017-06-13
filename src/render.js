/***************************************************************************************************************************************************************
 *
 * Render partials or even whole pages
 *
 * RenderReact    - Render a react component to string
 * RenderPage     - Render a page to HTML
 * RenderAllPages - Render all pages in the content folder
 * RenderPartial  - Render a partial to HTML
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile, CreateFile, RemoveDir } from './files';
import { GetContent, GetLayout } from './site';
import { ParseYaml, ParseFM } from './parse';
import ReactDOMServer from 'react-dom/server';
import { Layouts } from './watch';
import { Pages } from './site';
import React from 'react';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';


/**
 * Render a react component to string
 *
 * @param  {string} componentPath - The path to the react component
 * @param  {object} props         - The props
 *
 * @return {string}               - The static markup of the component
 */
export const RenderReact = ( componentPath, props ) => {
	Log.verbose(`Rendering react component ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.src, '' ) ) }`);

	try {
		// babelfy components
		// we have to keep the presets and plugins close as we want to support and even encourage global installs
		const registerObj = {
			presets: [
				Path.normalize(`${ __dirname }/../node_modules/babel-preset-es2015`),
				Path.normalize(`${ __dirname }/../node_modules/babel-preset-stage-0`),
				Path.normalize(`${ __dirname }/../node_modules/babel-preset-react`),
			],
		};

		// optional we redirect import statements for react to our local node_module folder
		// so react doesn’t have to be installed separately on globally installed cuttlebelle
		if( SETTINGS.get().site.redirectReact ) {
			registerObj.plugins = [
				Path.normalize(`${ __dirname }/../node_modules/babel-plugin-syntax-dynamic-import`),
				[
					Path.normalize(`${ __dirname }/../node_modules/babel-plugin-import-redirect`),
					{
						redirect: {
							react: Path.normalize(`${ __dirname }/../node_modules/react`),
						},
						suppressResolveWarning: true,
					},
				],
			];
		}

		require('babel-register')( registerObj );

		delete require.cache[ require.resolve( componentPath ) ]; //cache busting
		const component = require( componentPath ).default;

		return ReactDOMServer.renderToStaticMarkup( React.createElement( component, props ) );
	}
	catch( error ) {
		Log.error(`The react component ${ Style.yellow( componentPath.replace( SETTINGS.get().folder.src, '' ) ) } had trouble rendering:`);
		Log.error( error );

		return '';
	}
}


/**
 * Render a page to HTML
 *
 * @param  {string} page    - The relative URL of the page and where it sits in the content folder
 *
 * @return {promise object} - The string of the new path inside the site folder
 */
export const RenderPage = ( page ) => {
	Log.verbose(`Rendering page ${ Style.yellow( page ) }`);

	return new Promise( ( resolve, reject ) => {
		const content = Path.normalize(`${ SETTINGS.get().folder.content }/${ page }/${ SETTINGS.get().folder.index }`);

		ReadFile( content )                                               // reading index.yml
			.catch( error => reject( error ) )
			.then( body => {
				const allPartials = [];

				body = ParseYaml( body );                                     // parse the body of this page

				Pages.all[ page ] = body;                                     // updated the frontmatter of this page

				body.partials.map( partial => {
					let cwd = Path.dirname( content );                          // we assume relative links
					if( partial.startsWith('/') ) {                             // unless the layout starts with a slash
						cwd = SETTINGS.get().folder.content;
					}

					if( Fs.existsSync( Path.normalize(`${ cwd }/${ partial }.md`) ) ) {
						allPartials.push( RenderPartial( cwd, partial, page ) );  // render this partial and catch the content in the array
					}
					else {
						Log.info(`Partial not found ${ Style.yellow(`${ cwd }/${ partial }.md`) }`);
					}
				});

				Promise.all( allPartials )                                    // now that all partials have been compiled
					.catch( error => {
						Log.error(`Rendering partials failed`);
						Log.error( JSON.stringify( error ) );
					})
					.then( partials => {
						delete body.partials;
						body.layout = body.layout || SETTINGS.get().layouts.page;            // set the default layout

						Layouts.set( page, body.layout );                                    // keeping track of all pages per layout will make the watch better

						const parents = page.split('/').map( ( item, i ) => {
							return SETTINGS.get().site.root + page.split('/').splice( 0, page.split('/').length - i ).join('/');
						});

						const pageHTML = SETTINGS.get().site.doctype + RenderReact(          // and off we go into the react render machine while prefixing
							Path.normalize(`${ SETTINGS.get().folder.src }/${ body.layout }`), // our HTML with an optional doctype
							{
								_myself: page,
								_parents: parents,
								_sites: Pages.get(),
								_body: body.body,
								_partials: <div dangerouslySetInnerHTML={ { __html: partials.join('') } } />,
								...body
							}
						);

						const newPath = Path.normalize(`${ SETTINGS.get().folder.site }/${ page === SETTINGS.get().folder.homepage ? '' : page }/index.html`);

						CreateFile( newPath, pageHTML )
							.catch( error => reject( error ) )
							.then( () => resolve( newPath ) );
				});
			});
	});
};


/**
 * Render all pages in the content folder
 *
 * @param  {array}  content - An array of all pages
 * @param  {array}  content - An array of all layout components
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
				allPages.push( RenderPage( page ) );
			});

			Promise.all( allPages )
				.catch( error => {
					reject( JSON.stringify( error ) );
				})
				.then( pages => resolve( pages ) );
		});
	}
	else {
		return Promise.resolve([]);
	}
};


/**
 * Render a partial to HTML
 *
 * @param  {string} cwd     - The path of the current working directory inside the content folder
 * @param  {string} partial - The partial name
 * @param  {string} parent  - The name of the parent page
 *
 * @return {promise object} - The HTML string of the rendered partial
 */
export const RenderPartial = ( cwd, partial, parent ) => {
	Log.verbose(`Rendering partial ${ Style.yellow( Path.normalize(`${ cwd }/${ partial }.md`).replace( SETTINGS.get().folder.content, '' ) ) }`);

	return new Promise( ( resolve, reject ) => {
		const content = Path.normalize(`${ cwd }/${ partial }.md`); // @TODO make markdown optional

		ReadFile( content )
			.catch( error => reject( error ) )
			.then( partialContent => {
				partialContent = ParseFM( partialContent );                                                        // parse the front matter
				partialContent.body = <div dangerouslySetInnerHTML={ { __html: partialContent.body } } />          // parse the body

				if( !partialContent.frontmatter ) {
					partialContent.frontmatter = {};
				}

				partialContent.frontmatter.layout = partialContent.frontmatter.layout || SETTINGS.get().layouts.partial; // set the default layout

				Layouts.set( parent, partialContent.frontmatter.layout );                                            // keeping track of all pages

				const parents = parent.split('/').map( ( item, i ) => {
					return SETTINGS.get().site.root + parent.split('/').splice( 0, parent.split('/').length - i ).join('/');
				});

				const component = RenderReact(
					Path.normalize(`${ SETTINGS.get().folder.src }/${ partialContent.frontmatter.layout }`),               // parse the react component with it’s props
					{
						_myself: parent,
						_parents: parents,
						_sites: Pages.get(),
						_body: partialContent.body,
						...partialContent.frontmatter
					}
				);

				resolve( component );
			});
	});
};
