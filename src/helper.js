/***************************************************************************************************************************************************************
 *
 * Export shared helper code
 *
 * LAYOUTS       - A shared object to keep track of all pages and their layouts
 * ConvertHrtime - Convert hrtime to ms
 * Style         - Returning ansi escape color codes
 * Log           - A logging method
 * ExitHandler   - Handle exiting of program
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';


/**
 * A shared object to keep track of all pages and their layouts
 *
 * @type {Object}
 */
export const LAYOUTS = {};


/**
 * Convert hrtime to ms
 *
 * @param {array} elapsedTime - The elapsed time started and stopped with process.hrtime
 */
export const ConvertHrtime = ( elapsedTime ) => {
	return ( elapsedTime[ 0 ] + ( elapsedTime[ 1 ] / 1e9 ) ).toFixed( 3 );
}


/**
 * Returning ansi escape color codes
 * Credit to: https://github.com/chalk/ansi-styles
 *
 * @type {Object}
 */
export const Style = {

	/**
	 * Parse ansi code while making sure we can nest colors
	 *
	 * @param  {string} text  - The text to be enclosed with an ansi escape string
	 * @param  {string} start - The color start code, defaults to the standard color reset code 39m
	 * @param  {string} end   - The color end code
	 *
	 * @return {string}       - The escaped text
	 */
	parse: ( text, start, end = `39m` ) => {
		if( text !== undefined ) {
			const replace = new RegExp( `\\u001b\\[${ end }`, 'g' ); // find any resets so we can nest styles

			return `\u001B[${ start }${ text.toString().replace( replace, `\u001B[${ start }` ) }\u001b[${ end }`;
		}
		else {
			return ``;
		}
	},

	/**
	 * Style a string with ansi escape codes
	 *
	 * @param  {string} text - The string to be wrapped
	 *
	 * @return {string}      - The string with opening and closing ansi escape color codes
	 */
	black: text => Style.parse( text, `30m` ),
	red: text => Style.parse( text, `31m` ),
	green: text => Style.parse( text, `32m` ),
	yellow: text => Style.parse( text, `33m` ),
	blue: text => Style.parse( text, `34m` ),
	magenta: text => Style.parse( text, `35m` ),
	cyan: text => Style.parse( text, `36m` ),
	white: text => Style.parse( text, `37m` ),
	gray: text => Style.parse( text, `90m` ),
	bold: text => Style.parse( text, `1m`, `22m` ),

};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Logging prettiness
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * A logging object
 *
 * @type {Object}
 */
export const Log = {
	verboseMode: false, // verbose flag
	output: false,      // have we outputted something yet?
	hasError: false,    // let’s assume the best

	/**
	 * Log a welcome message
	 *
	 * @param  {string} text - The text you want to log
	 */
	welcome: ( text ) => {
		if( !Log.output ) {   // if we haven’t printed anything yet
			Log.space();        // only then we add an empty line on the top
		}

		console.error(` 🐙           ${ Style.bold(`${ text }`) }`);

		Log.output = true;   // now we have written something out
	},

	/**
	 * Log an error
	 *
	 * @param  {string} text - The text you want to log with the error
	 */
	error: ( text ) => {
		if( !Log.output ) {   // if we haven’t printed anything yet
			Log.space();        // only then we add an empty line on the top
		}

		console.error(` 🔥  ${ Style.red(`ERROR:   ${ text }`) }`);

		Log.output = true;   // now we have written something out
		Log.hasError = true; // and it was an error of all things
	},

	/**
	 * Log a message
	 *
	 * @param  {string}  text - The text you want to log
	 */
	info: ( text ) => {
		if( !Log.output ) {
			Log.space();
		}

		console.info(` 🔔  INFO:    ${ text }`);
		Log.output = true;
	},

	/**
	 * Log success
	 *
	 * @param  {string}  text - The text you want to log
	 */
	ok: ( text ) => {
		if( !Log.output ) {
			Log.space();
		}

		console.info(` ✔  ${ Style.green(`OK:`) }      ${ Style.green( text ) }`);
		Log.output = true;
	},

	/**
	 * Log the final message
	 *
	 * @param  {string}  text - The text you want to log
	 */
	done: ( text ) => {
		if( !Log.output ) {
			Log.space();
		}

		console.info(` 🚀           ${ Style.green( Style.bold( text ) ) }`);

		Log.output = true;
	},

	/**
	 * Log a verbose message
	 *
	 * @param  {string}  text    - The text you want to log
	 * @param  {boolean} verbose - Verbose flag either undefined or true
	 */
	verbose: ( text ) => {
		if( Log.verboseMode ) {
			if( !Log.output ) {
				Log.space();
			}

			console.info(` 😬  ${ Style.gray(`VERBOSE: ${ text }`) }`);
			Log.output = true;
		}
	},

	/**
	 * Add some space to the output
	 */
	space: () => {
		console.log(`\n`);
	},
};


/**
 * Handle exiting of program
 *
 * @param {null}   exiting - null for bind
 * @param {object} error   - Object to distinguish between closing events
 */
export const ExitHandler = ( exiting, error ) => {
	if( error && error !== 1 ) {
		try {              // try using our pretty output
			Log.error( error );
		}
		catch( error ) {   // looks like it’s broken too so let’s just do this old school
			console.error( error );
		}
	}

	if( exiting.withoutSpace ) {
		process.exit( 0 ); // exit now
	}

	Log.space();         // adding some space
	process.exit( 0 );   // now exit with a smile :)
};
