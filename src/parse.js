/***************************************************************************************************************************************************************
 *
 * Parsing different languages
 *
 * ParseContent - Parsing the content of a file into an object
 * ParseMD      - Parsing markdown into HTML
 * ParseYaml    - Parsing yaml into an object
 * ParseHTML    - Clean react output of any silly wrapping divs
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Marked from 'marked';
import React from 'react';
import YAML from 'js-yaml';
import Path from 'upath';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { SETTINGS } from './settings';


/**
 * Parsing the content of a file into an object
 *
 * @param  {string} content - The content of a partial with or without front matter
 * @param  {string} file    - The path of the file to determine what extension this is, optional, default: 'partial.md'
 * @param  {string} props   - An object of all props being passed to the markdown renderer, optional
 *
 * @return {object}         - An object with parsed out front matter and it’s parsed yaml and the body. format: { frontmatter: {}, body: '' }
 */
export const ParseContent = ( content, file = 'partial.md', props = {} ) => {
	Log.verbose(`Parsing content for ${ Style.yellow( file ) }`);

	if( typeof content === 'string' ) {
		const _isIndex = Path.extname( file ) === '.yml';
		const parsedBody = {};
		let frontmatter = '';
		let markdown = '';

		if( _isIndex ) {                         // if this is a yml file
			parsedBody.frontmatter = ParseYaml( content, file );
			parsedBody.body = '';
		}
		else if( content.startsWith('---\n') ) { // if this is another file that has frontmatter
			const bodyParts = content.split('---\n');

			parsedBody.frontmatter = bodyParts[1] ? ParseYaml( bodyParts[1], file ) : {};
			parsedBody.body = ParseMD( bodyParts.slice( 2 ).join('---\n'), file, props );
		}
		else {                                   // in all other cases (markdown without frontmatter)
			parsedBody.frontmatter = {};
			parsedBody.body = ParseMD( content, file, props );
		}

		return parsedBody;
	}
	else {
		return content;
	}
}


/**
 * Parsing markdown into HTML using https://github.com/chjj/marked
 *
 * @param  {string} markdown - The markdown string
 * @param  {string} file     - The file where this markdown comes from for error handling
 * @param  {string} props    - An object of all props for the custom renderer
 *
 * @return {string}          - HTML rendered from the given markdown
 */
export const ParseMD = ( markdown, file, props ) => {
	if( typeof markdown === 'string' ) {

		let renderer = new Marked.Renderer();

		if( SETTINGS.get().site.markdownRenderer ) {
			const filePath = Path.normalize(`${ process.cwd() }/${ SETTINGS.get().site.markdownRenderer }`);

			try {
				const customRenderer = require( filePath );
				renderer = customRenderer({ Marked: new Marked.Renderer(), ...props });
			}
			catch( error ) {
				Log.error(`Using the custom renderer for markdown caused an error at ${ Style.yellow( filePath ) }`);
				Log.error( error );

				if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
					process.exit( 1 );
				}
			}
		}

		try {
			if( typeof renderer.preparse === 'function' ) {
				markdown = renderer.preparse( markdown );
			}

			return Marked( markdown, { renderer: renderer } );
		}
		catch( error ) {
			Log.error(`Rendering markdown caused an error in ${ Style.yellow( file ) }`);
			Log.error( error );

			if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
				process.exit( 1 );
			}
		}
	}
	else {
		return markdown;
	}
}


/**
 * Parsing yaml into an object using https://github.com/jeremyfa/yaml.js
 *
 * @param  {string} yaml - A yaml string
 * @param  {string} file - The file where this yaml comes from for error handling
 *
 * @return {object}      - The parsed yaml
 */
export const ParseYaml = ( yaml, file ) => {
	if( typeof yaml === 'string' ) {
		try {
			return YAML.safeLoad( yaml, warning => Log.error( warning ) ) || {};
		}
		catch( error ) {
			Log.error(`Rendering yaml caused an error in ${ Style.yellow( file ) }`);
			Log.error( error );

			if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
				process.exit( 1 );
			}
		}
	}
	else {
		return yaml;
	}
}


/**
 * Clean react output of any silly wrapping divs
 *
 * @param  {string} html - The HTML generated with react
 *
 * @return {string}      - The cleaned HTML
 */
export const ParseHTML = ( html ) => {
	if( typeof html === 'string' ) {
		return html
			.replace(/<cuttlebellesillywrapper>/g, '')
			.replace(/<\/cuttlebellesillywrapper>/g, '');
	}
	else {
		return html;
	}
}
