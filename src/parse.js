/***************************************************************************************************************************************************************
 *
 * Parsing different languages
 *
 * ParseContent - Parsing the content of a file into an object
 * ParseMD      - Parsing markdown into HTML
 * ParseYaml    - Parsing yaml into an object
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Marked from 'marked';
import React from 'react';
import YAML from 'yamljs';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';


/**
 * Parsing the content of a file into an object
 *
 * @param  {string} content - The content of a partial with or without front matter
 * @param  {string} file    - The path of the file to determine what extension this is
 *
 * @return {object}         - An object with parsed out front matter and it’s parsed yaml and the body. format: { frontmatter: {}, body: '' }
 */
export const ParseContent = ( content, file ) => {
	Log.verbose(`Parsing content for ${ Style.yellow( file ) }`);

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
		parsedBody.body = ParseMD( bodyParts.slice( 2 ).join('---\n'), file );
	}
	else {                                   // in all other cases (markdown without frontmatter)
		parsedBody.frontmatter = {};
		parsedBody.body = ParseMD( content, file );
	}

	return parsedBody;
}


/**
 * Parsing markdown into HTML using https://github.com/chjj/marked
 *
 * @param  {string} markdown - The markdown string
 * @param  {string} file     - The file where this markdown comes from for error handling
 *
 * @return {string}          - HTML rendered from the given markdown
 */
export const ParseMD = ( markdown, file ) => {
	let renderer = new Marked.Renderer();

	if( SETTINGS.get().site.markdownRenderer ) {
		const filePath = Path.normalize(`${ process.cwd() }/${ SETTINGS.get().site.markdownRenderer }`);

		try {
			renderer = require( filePath );
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


/**
 * Parsing yaml into an object using https://github.com/jeremyfa/yaml.js
 *
 * @param  {string} yaml - A yaml string
 * @param  {string} file - The file where this yaml comes from for error handling
 *
 * @return {object}      - The parsed yaml
 */
export const ParseYaml = ( yaml, file ) => {
	try {
		return YAML.parse( yaml );
	}
	catch( error ) {
		Log.error(`Rendering yaml caused an error in ${ Style.yellow( file ) }`);
		Log.error( error );

		if( process.env.NODE_ENV === 'production' ) { // let’s die in a fiery death if something goes wrong in production
			process.exit( 1 );
		}
	}
}
