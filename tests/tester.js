/***************************************************************************************************************************************************************
 *
 * TESTER
 *
 * Running end to end tests
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { Path } = require('./../dist/path.js');
const Replace = require('replace-in-file');
const Spawn = require('child_process');
const Copydir = require('copy-dir');
const Dirsum = require('dirsum');
const Chalk = require('chalk');
const Diff = require('diff');
const Del = require('del');
const Fs = require(`fs`);


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TEST SUITE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const SETTINGS = {
	PASS: true,
	UNITS: [
		// {
		// 	name: 'Test1: testing partials, nesting, all props, assets, markdown, basics',
		// 	folder: 'site1',
		// 	script: {
		// 		options: [],
		// 	},
		// 	compare: 'site/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test2: testing docs generation',
		// 	folder: 'site2',
		// 	script: {
		// 		options: ['docs'],
		// 	},
		// 	compare: 'docs/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test3: testing package.json settings and custom md renderer',
		// 	folder: 'site3',
		// 	script: {
		// 		options: [],
		// 	},
		// 	compare: 'site2/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test4: testing partial deep nesting, nav and deep partial conversion',
		// 	folder: 'site4',
		// 	script: {
		// 		options: [],
		// 	},
		// 	compare: 'site/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test5: testing deep folder for content, code and assets',
		// 	folder: 'site5',
		// 	script: {
		// 		options: [],
		// 	},
		// 	compare: 'site/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test6: testing complex example of a real world site',
		// 	folder: 'site6',
		// 	script: {
		// 		options: [],
		// 	},
		// 	compare: 'site/',
		// 	empty: false,
		// },
		// {
		// 	name: 'Test7: testing docs with custom settings',
		// 	folder: 'site7',
		// 	script: {
		// 		options: ['docs'],
		// 	},
		// 	compare: 'docs2/',
		// 	empty: false,
		// },
		{
			name: 'Test8: small default html assembly test',
			folder: 'site8',
			script: {
				options: [],
			},
			compare: 'site/',
			empty: false,
		},
	],
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// TEST FLOW
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Initiating test
 */
const Tester = () => {
	let allTasks = [];

	Log.info(`Testing …`);

	// loop over all folders and start each test
	for( const unit of SETTINGS.UNITS ) {
		const scriptFolder = Path.normalize(`${ __dirname }/${ unit.folder }/`);

		allTasks.push(
			Delete( scriptFolder )                                      // delete trash first
				.then( ()      => CopyFixtures( scriptFolder, unit ) )    // copy fixtures
				.then( ()      => ReplaceFixtures( scriptFolder, unit ) ) // compile fixtures
				.then( ()      => Run( scriptFolder, unit ) )             // now run script
				.then( result  => Fixture( scriptFolder, unit, result ) ) // get hash for fixture
				.then( result  => Result( scriptFolder, unit, result ) )  // get hash for result of test
				.then( result  => Compare( scriptFolder, unit, result ) ) // now compare both and detail errors
				.then( success => {                                       // cleaning up after ourself
					if( success ) {
						return Delete( scriptFolder );
					}
					else {
						return Promise.resolve();
					}
				})
				.catch( error => Log.error(`Nooo: ${ error }`) )         // catch errors...
		);
	}

	// finished with all tests
	Promise.all( allTasks )
		.catch( error => {
			Log.error(`An error occurred: ${ Chalk.bgWhite.black(` ${ Path.basename( error ) } `) }`);

			process.exit( 1 );
		})
		.then( () => {
			if( SETTINGS.PASS ) {
				Log.finished(`😅  All tests have passed`);

				process.exit( 0 );
			}
			else {
				Log.finished(`😳  Ouch! Some tests failed`);

				process.exit( 1 );
			}
	});

};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// HELPER FUNCTION
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/**
 * Flatten a deep object into a one level object with it’s path as key
 *
 * @param  {object} object - The object to be flattened
 *
 * @return {object}        - The resulting flat object
 */
const Flatten = object => {
	return Object.assign( {}, ...function _flatten( objectBit, path = '' ) {  // spread the result into our return object
		return [].concat(                                                       // concat everything into one level
			...Object.keys( objectBit ).map( key => {                             // iterate over object
				const item = objectBit[ key ];
				if( typeof item === 'object' ) {                                    // check if there is a nested object
					const contents = Object.keys( item );
					if(
						contents[ 0 ] === 'files' &&
						contents[ 1 ] === 'hash' &&
						contents.length === 2
					) {                                                               // we ignore every level with [files,hash] array
						return _flatten( item.files, `${ path }/${ key }` );            // call itself with the contents of .files and ignore this level
					}
					else {
						return _flatten( item, `${ path }/${ key }` );                  // call itself with full object and path
					}
				}
				else {
					return ( { [ `${ path }/${ key }` ]: item } );                    // append object with it’s path as key
				}
			})
		)
	}( object ) );
};


/**
 * Deleting files from previous tests
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 *
 * @return {Promise object}
 */
const Delete = ( path ) => {
	const trash = [
		Path.normalize(`${ path }/site`),
		Path.normalize(`${ path }/docs`),
		Path.normalize(`${ path }/docs2`),
		Path.normalize(`${ path }/testfolder/`),
		Path.normalize(`${ path }/*.log.*`),
		Path.normalize(`${ path }/assets/**/.DS_Store`),
		Path.normalize(`${ path }/fixture/**/.DS_Store`),
		Path.normalize(`${ path }/_fixture/`),
	];

	return new Promise( ( resolve, reject ) => {
		Del( trash )
			.catch( error => {
				reject( error );
			})
			.then( paths => {
				// Log.pass(`Cleaned ${ Chalk.bgWhite.black(` ${ path } `) } folder`);

				resolve();
		});
	});
};


/**
 * Copy fixture files into a temp folder for later processing
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const CopyFixtures = ( path, settings ) => {
	return new Promise( ( resolve, reject ) => {
		if( settings.empty ) {
			resolve();
		}
		else {
			Copydir( Path.normalize(`${ path }/fixture/`) , Path.normalize(`${ path }/_fixture/`), error => {
				if( error ) {
					reject( error );
				}
				else {
					resolve();
				}
			});
		}
	});
};


/**
 * Replace placeholders in temp fixtures
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const ReplaceFixtures = ( path, settings ) => {
	return new Promise( ( resolve, reject ) => {
		if( settings.empty ) {
			resolve();
		}
		else {
			// maybe in the future we have dynamic paths that depend on the system they are tested on.

			// Replace({
			// 		files: [
			// 			Path.normalize(`${ path }/_fixture/**`),
			// 		],
			// 		from: [
			// 			/\[thing\]/g,
			// 		],
			// 		to: [
			// 			'thing',
			// 		],
			// 		allowEmptyPaths: true,
			// 		encoding: 'utf8',
			// 	})
			// 	.catch( error => {
			// 		reject( error );
			// 	})
			// 	.then( changedFiles => {
					resolve();
			// });
		}
	});
};


/**
 * Running shell script
 *
 * @param  {string} path     - The path to the shell script
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const Run = ( path, settings ) => {
	return new Promise( ( resolve, reject ) => {
		let errors = '';
		let output = '';

		// what the command would look like:
		// console.log('node', [ Path.normalize(`${ path }/../../dist/index.js`), ...settings.script.options ].join(' '));
		// console.log(`in ${ path }`);

		const command = Spawn
			.spawn( 'node', [ Path.normalize(`${ path }/../../dist/index.js`), ...settings.script.options ], {
				cwd: path,
			}
		);

		command.stdout.on('data', ( data ) => {
			output += data.toString();
		})

		command.stderr.on('data', ( data ) => {
			errors += data.toString();
		})

		command.on( 'close', ( code ) => {
			if( code === 0 ) {
				// Log.pass(`Ran test in ${ Chalk.bgWhite.black(` ${ Path.basename( path ) } `) } folder`);

				resolve({ output });
			}
			else {
				SETTINGS.PASS = false;

				reject(`Script errored out with:\n${ Chalk.bold( errors ) }`);
			}
		});
	});
};


/**
 * Get the checksum hash for the fixture of a test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 * @param  {object} result   - The output of the command
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Fixture = ( path, settings, result ) => {
	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( Path.normalize(`${ path }/_fixture/${ settings.compare }/`), 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.pass( error );

					SETTINGS.PASS = false;

					reject( error );
				}
				else {
					resolve({
						fixture: hashes,
						output: result.output,
					});
				}
			});
		}
		else {
			resolve({
				output: result.output,
			});
		}
	});
};


/**
 * Get the checksum hash for the result of the test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 * @param  {object} result   - The hash results of fixture and output
 *
 * @return {Promise object}  - The hash object of all files inside the resulting files
 */
const Result = ( path, settings, result ) => {
	const location = Path.normalize(`${ path }/${ settings.compare }/`);
	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( location, 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.error( error );

					SETTINGS.PASS = false;

					reject();
				}
				else {
					resolve({ // passing it to compare later
						result: hashes,
						fixture: result.fixture,
						output: result.output,
					});
				}
			});
		}
		else {
			Fs.access( location, Fs.constants.R_OK, error => {

				if( !error || error.code !== 'ENOENT' ) {
					Log.fail(`${ Chalk.bgWhite.black(` ${ settings.name } `) } failed becasue it produced files but really shoudn’t`);

					SETTINGS.PASS = false;

					resolve({
						fixture: {
							hash: 'xx',
							files: {
								location: 'nope',
							},
						},
						result: {
							hash: 'xxx',
							files: {
								location: 'nope',
							},
						},
						output: result.output,
					});

				}
				else {

					resolve({
						fixture: {
							hash: 'xxx',
						},
						result: {
							hash: 'xxx',
						},
						output: result.output,
					});

				}
			});
		}
	});
};


/**
 * Compare the output of a test against its fixture
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 * @param  {object} result   - The hash results of fixture and result
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Compare = ( path, settings, result ) => {

	return new Promise( ( resolve, reject ) => {
		if( result.fixture.hash === result.result.hash ) {
			Log.pass(`${ Chalk.bgWhite.black(` ${ settings.name } `) } passed`); // yay

			resolve( true );
		}
		else { // grr
			SETTINGS.PASS = false;
			Log.fail(`${ Chalk.bgWhite.black(` ${ settings.name } `) } failed`);

			// flatten hash object
			const fixture = Flatten( result.fixture.files );
			const output = Flatten( result.result.files );

			// iterate over fixture
			for( const file of Object.keys( fixture ) ) {
				const compare = output[ file ]; // get the hash from our result folder
				delete output[ file ];          // remove this one so we can keep track of the ones that were not inside the fixture folder

				if( compare === undefined ) {  // we couldn’t find this file inside the resulting folder
					Log.error(`🛑  Missing ${ Chalk.yellow( file ) } file inside result folder`);
				}
				else {
					const fileName = file.split('/');

					if( fixture[ file ] !== compare && fileName[ fileName.length - 1 ] !== 'hash' ) { // we don’t want to compare folders
						const locationResult = Path.normalize(`${ path }/${ settings.compare }/${ file }`);
						const locationFixture = Path.normalize(`${ path }/_fixture/${ settings.compare }/${ file }`);

						const contentResult = Fs.readFileSync( locationResult, `utf8` );
						const contentFixture = Fs.readFileSync( locationFixture, `utf8` );
						const fixtureName = Chalk.yellow( settings.folder + file );

						Log.error(`🛑  Difference inside ${ fixtureName } file`);
						Log.error(`>>> ${ fixtureName }\n${ contentResult }\n        <<<`);

						const diff = Diff.diffChars( contentResult, contentFixture );
						let diffOutput = '';
						diff.forEach( part => {
							if( part.added || part.removed ) {
								diffOutput += `${ Chalk[ part.added ? 'underline' : 'strikethrough' ][ part.added ? 'green' : 'red' ]( part.value ) }`;
							}
							else {
								diffOutput += Chalk.white(`${ part.value.substring( 0, 50 ) }${ Chalk.gray('[...]') }${ part.value.slice( -50 ) }`);
							}
						});
						Log.error(`${ diffOutput }\n        Output:${ Chalk.reset( result.output ) }`);
					}
				}
			}

			if( Object.keys( output ).length > 0 ) { // found files that have not been deleted yet
				let files = [];

				for( const file of Object.keys( output ) ) {
					files.push( file ); // make ’em readable
				}

				Log.error(`🛑  Some new files not accounted for: ${ Chalk.yellow( files.join(', ') ) } inside the fixture folder`);
			}

			resolve( false );
		}
	});
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Log to console.log
//
// @method  info                       Log info
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//
// @method  finished                   Log the finishing message
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//
// @method  error                      Log errors
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//
// @method  pass                       Log a pass
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//
// @method  fail                       Log a fail
//          @param   [text]  {string}  The sting you want to log
//          @return  [ansi]            output
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Log = {

	info: ( text ) => {
		console.log(`\n\n        ${ text }\u001b[1F`);
	},

	finished: ( text ) => {
		console.log(`\n        ${ text }\n\n`);
	},

	error: ( text ) => {
		console.error(`\n        ${ Chalk.red( text ) }\u001b[1F`);
	},

	pass: ( text ) => {
		console.log(`${ Chalk.bgGreen.bold(`\n  OK  `) } ${ Chalk.bgGreen.white.bold(` ${ text }`) }\u001b[1F`);
	},

	fail: ( text ) => {
		console.error(`${ Chalk.bgRed.bold(`\n FAIL `) } ${ Chalk.bgRed.white.bold(` ${ text }`) }\u001b[1F`);
	},
};


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RUN SUIT
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Tester();
