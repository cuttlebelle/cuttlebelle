/***************************************************************************************************************************************************************
 *
 * Build documentation from your react layouts
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const ReactDocs = require('react-docgen');
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile, CreateFile, CreateDir, RemoveDir, CopyFiles } from './files';
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';
import { GetLayout } from './site';


/**
 * The source of our ipsum lorem
 *
 * @type {string}
 */
const Ipsum = Fs.readFileSync( Path.normalize(`${ __dirname }/../assets/ipsum.txt`), 'utf8' );


/**
 * Build our docs from the source folder
 */
export const BuildDocs = () => {
	Log.info(`Generating docs`);

	const layouts = GetLayout();
	const categories = GetCategories( layouts );
	const allLayouts = [];

	categories.map( layout => {
		allLayouts.push(
			//
		);
	});

	return new Promise( ( resolve, reject ) => {
		Promise.all( allLayouts )
			.catch( error => reject( error ) )
			.then( infos => {
				// loop over array

				resolve();
		});
	});
}


/**
 * Get all categories from our src/ folders
 *
 * @param  {array} layouts - An array of all layout components
 *
 * @return {array}         - An array of all category paths
 */
export const GetCategories = ( layouts ) => {
	Log.verbose(`Getting all categories`);

	const categories = [];

	layouts.map( layout => {
		const category = Path.dirname( layout );

		if( !categories.includes( category ) ) {
			categories.push( category );
		}
	});

	return categories;
};


export const CreateCategory = ( layouts, category ) => {
	const allLayouts = [];

	layouts.map( layout => {
		if( layout.starsWith( category ) ) {
			allLayouts.push(
				GetParsedLayout( layout )
					.catch( error => reject( error ) )
			);
		}
	});

	return new Promise( ( resolve, reject ) => {
		Promise.all( allLayouts )
			.catch( error => reject( error ) )
			.then( data => {
				// loop over array
				const yaml = BuildYaml( infos[0] );

				console.log(yaml);

				resolve();
		});
	});
};


/**
 * Get infos about a react component by running it through our propType parser
 *
 * @param  {string} layout  - The path to the layout file
 *
 * @return {Promise object} - The object with all gathered infos
 */
export const GetParsedLayout = ( layout ) => {
	Log.verbose(`Getting layout infos from ${ Style.yellow( layout ) }`);

	return new Promise( ( resolve, reject ) => {

		const componentPath = Path.normalize(`${ SETTINGS.get().folder.src }/${ layout }`);

		try {
			ReadFile( componentPath )
				.catch( error => reject( error ) )
				.then( react => resolve({
					file: layout,
					...ReactDocs.parse( react ),
				})
			);
		}
		catch( error ) {
			Log.error(`Trying to gather infos from the react components failed.`);
			Log.error( error );

			process.exit( 1 );
		}
	});
};


export const BuildYaml = ( object ) => {
	let yaml = '';
	let _hasBody = false;

	if( object.props ) {
		Object.keys( object.props ).map( prop => {
			console.log(prop);
			if( prop === '_body' ) {
				_hasBody = true;
			}
			else {
				if( object.props[ prop ].type.name === 'string' ) {
					yaml += `${ prop }: Some string`;
				}

				if( object.props[ prop ].type.name === 'array' ) {
					yaml += `${ prop }:\n  - Some string`;
				}
			}
		});
	}

	if( _hasBody ) {
		yaml = `---\n${ yaml }\n---\n\nSome markdown text\n`;
	}

	return yaml;
};


/**
 * Build some dummy text from a text file with n amount of sentences
 *
 * @param  {integer} amount - Amount of sentences
 *
 * @return {string}         - The dummy text
 */
export const BuildIpsum = ( amount ) => {
	const sentences = Ipsum.split('.');
	let output = '';

	if( amount >= sentences.length ) {
		const mulitplier = Math.floor( amount / sentences.length );
		output = `${ Ipsum }\n`.repeat( mulitplier );

		amount -= mulitplier * sentences.length;
	}

	for( let i = 0; i < amount; i++ ) {
		output += `${ sentences[ i ] }.`;
	};

	return output;
};
