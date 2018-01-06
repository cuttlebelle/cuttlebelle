/***************************************************************************************************************************************************************
 *
 * Display various cli options
 *
 * DisplayHelp    - Display the help
 * DisplayVersion - Display the version of cuttlebelle
 * DisplayWelcome - Display the welcome message
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Size from 'window-size';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';


/**
 * Our own package.json
 *
 * @type {object}
 */
const pkg = require('../package.json');


/**
 * Display the help
 */
export const DisplayHelp = () => {
	const maxLength = 80;
	const paddingSize = Math.max( 0, Math.floor( ( Size.width - maxLength ) / 2 ) );
	const padding = String.repeat(` `, paddingSize );

	Log.space();
	console.log(`
${ padding }╔═╗ ╦ ╦ ╔╦╗ ╔╦╗ ╦   ╔═╗ ╔╗  ╔═╗ ╦   ╦   ╔═╗
${ padding }║   ║ ║  ║   ║  ║   ║╣  ╠╩╗ ║╣  ║   ║   ║╣
${ padding }╚═╝ ╚═╝  ╩   ╩  ╩═╝ ╚═╝ ╚═╝ ╚═╝ ╩═╝ ╩═╝ ╚═╝ v${ pkg.version }

${ padding }The react.js static site generator with editing in mind.

${ padding }Options:
${ padding }                - Building all pages
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle`) ) }

${ padding }  ${ Style.bold(`init`) }          - Create a clean slate website to get you started
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-i`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle init`) ) }

${ padding }  ${ Style.bold(`docs`) }          - Build documentation from your layout components
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-d`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle docs`) ) }

${ padding }  ${ Style.bold(`watch`) }         - Start to watch the content and source folder for changes
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-w`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle watch`) ) }

${ padding }  ${ Style.bold(`--no-generate`) } - Disable generation of all pages, best in combination with watch
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-n`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle watch --no-generate`) ) }

${ padding }  ${ Style.bold(`--silent`) }      - Disable all notifications the watch might throw
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-s`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle watch --silent`) ) }

${ padding }  ${ Style.bold(`--version`) }     - Display the version of Cuttlebelle
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-V`) ) } ${ Style.gray('(uppercased)') }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --version`) ) }

${ padding }  ${ Style.bold(`--verbose`) }     - Enable silly verbose mode
${ padding }                - Shortcut: ${ Style.yellow( Style.bold(`-v`) ) }
${ padding }  ${ Style.gray(`$`) } ${ Style.yellow( Style.bold(`cuttlebelle --verbose`) ) }

${ padding }  ${ Style.gray( pkg.homepage ) }
`);
	Log.space();

	process.exit( 0 );
}


/**
 * Display the version of cuttlebelle
 */
export const DisplayVersion = () => {
	console.log(`Cuttlebelle v${ pkg.version }`);

	process.exit( 0 );
};


/**
 * Display the welcome message
 */
export const DisplayWelcome = () => {
	Log.welcome(`Cuttlebelle v${ pkg.version }`);
}
