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
import { GetContent, GetLayout, ReadFile, CreateFile, RemoveDir } from './files';
import { ParseYaml, ParseFM } from './parse';
import ReactDOMServer from 'react-dom/server';
import { KeepTrack } from './watch';
import React from 'react';
import Path from 'path';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS, Log, Style } from './helper';


/**
 * Render a react component to string
 *
 * @param  {string} componentPath - The path to the react component
 * @param  {object} props         - The props
 *
 * @return {string}               - The static markup of the component
 */
export const RenderReact = ( componentPath, props ) => {
	Log.verbose(`Rendering react component ${ Style.yellow( componentPath.replace( SETTINGS.folder.src, '' ) ) }`);

	const component = require( componentPath ).default;

	try {
		return ReactDOMServer.renderToStaticMarkup( React.createElement( component, props ) );
	}
	catch( error ) {
		Log.error(`The react component ${ Style.yellow( componentPath.replace( SETTINGS.folder.src, '' ) ) } had trouble rendering:`);
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
		const content = Path.normalize(`${ SETTINGS.folder.content }/${ page }/${ SETTINGS.folder.index }`);

		ReadFile( content )                                               // reading index.yml
			.catch( error => reject( error ) )
			.then( body => {
				const allPartials = [];

				body = ParseYaml( body );                                     // parse the body of this page

				body.partials.map( partial => {
					let cwd = Path.dirname( content );                          // we assume relative links
					if( partial.startsWith('/') ) {                             // unless the layout starts with a slash
						cwd = SETTINGS.folder.content;
					}

					allPartials.push( RenderPartial( cwd, partial, page ) );    // render this partial and catch the content in the array
				});

				Promise.all( allPartials )                                    // now that all partials have been compiled
					.catch( error => {
						Log.error(`Rendering partials failed`);
						Log.error( JSON.stringify( error ) );
					})
					.then( partials => {
						delete body.partials;
						body.layout = body.layout || SETTINGS.layouts.page;                            // set the default layout

						KeepTrack( page, body.layout );                                                // keeping track of all pages per layout will make the watch better

						const parents = page.split('/').map( ( item, i ) => {
							return SETTINGS.root + page.split('/').splice( 0, page.split('/').length - i ).join('/');
						});

						const pageHTML = SETTINGS.doctype + RenderReact(                               // and off we go into the react render machine while prefixing
							Path.normalize(`${ SETTINGS.folder.src }/${ body.layout }`),                 // our HTML with an optional doctype
							{
								_myself: page,
								_parents: parents,
								_body: body.body,
								_partials: <div dangerouslySetInnerHTML={ { __html: partials.join('') } } />,
								...body
							}
						);

						const newPath = Path.normalize(`${ SETTINGS.folder.site }/${ page === 'index' ? '' : page }/index.html`);

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
 * @return {promise object} - The array of all pages
 */
export const RenderAllPages = () => {
	Log.verbose(`Rendering all pages`);

	const content = GetContent();
	Log.verbose(`Found following content:\n${ Style.yellow( JSON.stringify( content ) ) }`);

	const layout = GetLayout();
	Log.verbose(`Found following layout:\n${ Style.yellow( JSON.stringify( layout ) ) }`);

	RemoveDir([ SETTINGS.folder.site ]);

	return new Promise( ( resolve, reject ) => {
		const allPages = [];

		content.forEach(page => {
			allPages.push( RenderPage( page ) );
		});

		Promise.all( allPages )
			.catch( error => {
				reject( JSON.stringify( error ) );
			})
			.then( pages => resolve( pages ) );
	});
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
	Log.verbose(`Rendering partial ${ Style.yellow( partial ) }`);

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

				partialContent.frontmatter.layout = partialContent.frontmatter.layout || SETTINGS.layouts.partial; // set the default layout

				KeepTrack( parent, partialContent.frontmatter.layout );                                            // keeping track of all pages

				const parents = parent.split('/').map( ( item, i ) => {
					return SETTINGS.root + parent.split('/').splice( 0, parent.split('/').length - i ).join('/');
				});

				const component = RenderReact(
					Path.normalize(`${ SETTINGS.folder.src }/${ partialContent.frontmatter.layout }`),               // parse the react component with it’s props
					{
						_myself: parent,
						_parents: parents,
						_body: partialContent.body,
						...partialContent.frontmatter
					}
				);

				resolve( component );
			});
	});
};
