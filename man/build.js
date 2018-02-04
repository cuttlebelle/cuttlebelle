/***************************************************************************************************************************************************************
 *
 * BUILD MAN PAGE
 *
 * Injecting the current version of cuttlebelle into our man page
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { spawnSync } = require( 'child_process' );
const PGK = require('../package.json');
const Chalk = require('chalk');
const Path = require('upath');
const Fs = require('fs');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Generating man page
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const args = [
	`--version`,
	`"${ PGK.version }"`,
	`--manual`,
	`"Cuttlebelle Help"`,
	`--section`,
	`1`,
	`man.md`,
];

const cmd = spawnSync( 'marked-man', args, { cwd: __dirname } );

if( cmd.stderr.toString().length ) {
	console.log(`An error occured when executing: ${ Chalk.yellow(`marked-man ${ args.join(' ') }`) } inside: ${ Chalk.yellow( __dirname ) }`);
	console.error( Chalk.red( cmd.stderr.toString() ) );

	process.exit( 1 );
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Writing man page
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
if( cmd.stdout ) {
	const manpage = cmd.stdout.toString();
	const manfile = Path.normalize(`${ __dirname }/cuttlebelle.1`);

	Fs.writeFileSync( manfile, manpage, `utf-8`, ( error ) => {
		if( error ) {
			console.log(`An error occured when writing: ${ Chalk.yellow( manfile ) }`);
			console.error( Chalk.red( error ) );
			process.exit( 1 );
		}
		else {
			console.log( Chalk.green(`✔︎ man page successfully compiled\n`) );
			process.exit( 0 );
		}
	});
}
