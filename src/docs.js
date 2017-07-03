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
import { RenderReact } from './render';
import { Log, Style } from './helper';
import { ParseYaml, ParseMD } from './parse';
import { GetLayout } from './site';


/**
 * The source of our ipsum lorem
 *
 * @type {string}
 */
const Ipsum = Fs.readFileSync( Path.normalize(`${ __dirname }/../assets/ipsum.txt`), 'utf8' );


/**
 * The layout files we use to render the docs
 *
 * @type {Object}
 */
const Layout = {
	index: '.template/docs/layout/index.js',
	category: '.template/docs/layout/category.js',
};


/**
 * Build our docs from the source folder
 */
export const BuildDocs = () => {
	Log.info(`Generating docs`);

	const components = GetLayout();
	const categories = GetCategories( components );
	const allLayouts = [];

	categories.map( category => {
		allLayouts.push(
			GetCategoryComponents( category, components )
		);
	});


	return new Promise( ( resolve, reject ) => {
		Promise.all( allLayouts )
			.catch( error => reject( error ) )
			.then( pages => {
				const allPages = [];

				pages.map( page => {
					allPages.push(
						CreateCategory( page )
					);
				});

				allPages.push(
					CreateIndex()
				);

				Promise.all( allPages )
					.catch( error => reject( error ) )
					.then( () => {
						resolve();
					});
		});
	});
}


/**
 * Get all categories from our src/ folders
 *
 * @param  {array} components - An array of all layout components
 *
 * @return {array}            - An array of all category paths
 */
export const GetCategories = ( components ) => {
	Log.verbose(`Getting all categories`);

	const categories = [];

	components.map( component => {
		const category = Path.dirname( component );

		if( !categories.includes( category ) ) {
			categories.push( category );
		}
	});

	Log.verbose(`Categories are:\n${ Style.yellow( JSON.stringify( categories ) ) }`);

	return categories;
};


/**
 * Pick all components of a category and send them to the parser
 *
 * @param  {string} category   - The category we are in
 * @param  {array}  components - All components in a neat array
 *
 * @return {Promise object}    - The parsed components
 */
export const GetCategoryComponents = ( category, components ) => {
	Log.verbose(`Getting all components for categories ${ Style.yellow( category ) }`);

	const allComponents = [];

	if( Array.isArray( components ) ) {

		return new Promise( ( resolve, reject ) => {

			components.map( component => {
				if( Path.dirname( component ) === category ) {
					Log.verbose(`Found component ${ Style.yellow( component ) } for categories ${ Style.yellow( category ) }`);

					allComponents.push(
						ParseComponent( component )                                // Parse the component first
							.then( ( data ) => BuildPropsYaml( data, component ) )   // then we build the yaml and props
							.then( ( data ) => BuildHTML( data, component ) )        // now we shoot it all into the HTML blender
							.then( data => Object.assign( {}, { category }, data ) ) // and finally we keep category in our return value
					);
				}
			});

			Promise.all( allComponents )
				.catch( error => reject( error ) )
				.then( parsedComponents => resolve( parsedComponents ) );
		});
	}
	else {
		Promise.reject(`Components must be an array, was "${ Style.yellow( typeof components ) }"`);
	}
};


/**
 * Generate the category html and write it to disk
 *
 * @param  {array}  components          - An array of all components parsed
 * @param  {string} components.category - The category of this component
 * @param  {string} components.file     - The file name of this component
 * @param  {string} components.yaml     - The parsed yaml markup
 * @param  {string} components.html     - The parsed HTML
 *
 * @return {Promise object}             - Resolve when done
 */
export const CreateCategory = ( components ) => {
	Log.verbose(`Creating category ${ Style.yellow( components.category ) }`);

	return new Promise( ( resolve, reject ) => {
		const categoryPath = Path.normalize(`${ SETTINGS.get().folder.docs }/${ components[ 0 ].category }/index.html`);
		const layoutPath = Path.normalize(`${ __dirname }/../${ Layout.category }`);

		const props = {
			title: `Category ${ components[ 0 ].category }`,
			category: components[ 0 ].category,
			components: components,
		};

		const html = RenderReact( layoutPath, props );

		CreateFile( categoryPath, html )
			.catch( error => reject( error ) )
			.then( () => resolve() );
	});
};


/**
 * [description]
 * @param  {[type]} object [description]
 * @return {[type]}        [description]
 */
export const CreateIndex = ( object ) => {
	Log.verbose(`Creating index page`);

	return new Promise( ( resolve, reject ) => {
		resolve();
	})
};


/**
 * Get infos about a react component by running it through our propType parser
 *
 * @param  {string} component  - The path to the layout file
 *
 * @return {Promise object}    - The object with all gathered infos, format: { file: '', infos: {} }
 */
export const ParseComponent = ( component ) => {
	Log.verbose(`Getting component infos from ${ Style.yellow( component ) }`);

	return new Promise( ( resolve, reject ) => {

		const componentPath = Path.normalize(`${ SETTINGS.get().folder.src }/${ component }`);

		ReadFile( componentPath )
			.catch( error => reject( error ) )
			.then( react => {
				try {
					resolve({
						file: component,
						infos: ReactDocs.parse( react ),
					});
				}
				catch( error ) {
					Log.error(`Trying to gather infos from the react component ${ Style.yellow( component ) } failed.`);
					Log.error( error );

					process.exit( 1 );
				}
			}
		);
	});
};


/**
 * Build our props and yaml from the description of our propTypes
 *
 * @param  {object} object          - The object with infos about this react component
 * @param  {string} object.file     - The file path and name
 * @param  {object} object.infos    - The object with parsed infos about the react component
 *
 * @return {object}                 - The object with all gathered infos, format: { file: '', contents: '', infos: {}, props: {}, yaml: '' }
 */
export const BuildPropsYaml = ( object, component ) => {
	Log.verbose(`Building props and yaml from the gathered infos for ${ Style.yellow( component ) }`);

	return new Promise( ( resolve, reject ) => {
		const flags = {
			required: ' <span class="flag flag--optional">Optional</span>',
			default: ( value ) => ` <span class="flag flag--default">default: <span class="flag__value">${ value }</span></span>`,
		};
		let props = {};
		let yaml = '';

		if( object.infos.props ) {
			Object.keys( object.infos.props ).map( propKey => {
				const prop = object.infos.props[ propKey ];
				let example;

				prop.description = prop.description || '';

				example = ParseExample( prop.description );
				props = Object.assign( {}, props, ParseYaml( example ) );

				yaml += `${ example }${ prop.required ? '' : flags['required'] }${ prop.defaultValue ? flags['default']( prop.defaultValue.value ) : '' }\n`;
			});
		}

		resolve({
			file: object.file,
			infos: object.infos,
			props,
			yaml,
		})
	});
};


/**
 * Build out HTML for the component so we can show it
 *
 * @param  {object} object          - The object with infos about this react component
 * @param  {string} object.file     - The file path and name
 * @param  {object} object.infos    - The object with parsed infos about the react component
 * @param  {object} object.props    - The object with all props we need
 * @param  {string} object.yaml     - The yaml
 *
 * @return {object}                 - The object with all gathered infos, format: { file: '', yaml: '', html: '' }
 */
export const BuildHTML = ( object, component ) => {
	Log.verbose(`Building HTML for ${ Style.yellow( component ) }`);

	return new Promise( ( resolve, reject ) => {
		const componentPath = Path.normalize(`${ SETTINGS.get().folder.src }/${ object.file }`);
		const html = RenderReact( componentPath, object.props );

		resolve({
			file: object.file,
			yaml: object.yaml,
			html,
		})
	});
};


/**
 * Parse an example string
 *
 * @param  {string} example - The example from our props description
 *
 * @return {sting}          - The example with all magic strings replaced
 */
export const ParseExample = ( example ) => {
	Log.verbose(`Parsing example for magic inside ${ Style.yellow( example ) }`);

	const vocabulary = [
		{
			name: 'partials',
			function: MakePartials,
		},
		{
			name: 'text',
			function: MakeIpsum,
		},
	];
	let parsedExample = example;

	vocabulary.map( command => {
		if( example.includes(`[${ command.name }]`) ) {
			const partials = example.split(`[${ command.name }](`);
			const amount = parseInt( partials[ 1 ].slice( 0, -1 ) );

			if( amount > 0 ) {
				parsedExample = parsedExample.replace( `[${ command.name }](${ amount })`, command.function( amount ) );
			}

		}
	});

	return parsedExample;
};


/**
 * Make a partial placeholder
 *
 * @param  {integer} amount - The amount of partials we want to show
 *
 * @return {string}         - The partial placeholders
 */
export const MakePartials = ( amount ) => {
	return 'image '.repeat( amount );
};


/**
 * Make some dummy text from a text file with n amount of sentences
 *
 * @param  {integer} amount - Amount of sentences
 *
 * @return {string}         - The dummy text
 */
export const MakeIpsum = ( amount ) => {
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

	return ParseMD( output ).replace(/(?:\r\n|\r|\n)/g, '');
};
