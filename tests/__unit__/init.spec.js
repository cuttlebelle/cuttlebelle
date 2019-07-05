/***************************************************************************************************************************************************************
 *
 * init.js unit tests
 *
 * @file - src/init.js
 *
 * Tested methods:
 * Init
 * CopyStuff
 *
 **************************************************************************************************************************************************************/


import { CreateDir, RemoveDir } from '../../src/files';
import { Init, CopyStuff } from '../../src/init';
import { SETTINGS } from '../../src/settings';
import { Path } from '../../src/path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const testDir = `${ __dirname }/temp2/`;
SETTINGS.get().folder = {
	content: Path.normalize(`${ testDir }/content/`),
	code: Path.normalize(`${ testDir }/code/`),
	assets: Path.normalize(`${ testDir }/assets/`),
};

beforeEach(() => {
	CreateDir( testDir );
});

afterEach(() => {
	RemoveDir( testDir );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Init
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Init() - Init should create three folders', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Init();

	expect( Fs.existsSync( `${ testDir }/content/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/code/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/assets/` ) ).toEqual( true );
});


test('Init() - Init should not create any folders if the content folder exists', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	CreateDir( Path.normalize(`${ testDir }/content/`) );

	Init();

	expect( Fs.existsSync( `${ testDir }/content/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/code/` ) ).toEqual( false );
	expect( Fs.existsSync( `${ testDir }/assets/` ) ).toEqual( false );
});

test('Init() - Init should not create any folders if the code folder exists', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	CreateDir( Path.normalize(`${ testDir }/code/`) );

	Init();

	expect( Fs.existsSync( `${ testDir }/content/` ) ).toEqual( false );
	expect( Fs.existsSync( `${ testDir }/code/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/assets/` ) ).toEqual( false );
});

test('Init() - Init should not create any folders if the assets folder exists', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	CreateDir( Path.normalize(`${ testDir }/assets/`) );

	Init();

	expect( Fs.existsSync( `${ testDir }/content/` ) ).toEqual( false );
	expect( Fs.existsSync( `${ testDir }/code/` ) ).toEqual( false );
	expect( Fs.existsSync( `${ testDir }/assets/` ) ).toEqual( true );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CopyStuff
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('CopyStuff() - Copy the assets folder successfully', () => {
	CopyStuff('assets');

	expect( Fs.existsSync( `${ testDir }/assets/` ) ).toEqual( true );
});

test('CopyStuff() - Copy the content folder successfully', () => {
	CopyStuff('content');

	expect( Fs.existsSync( `${ testDir }/content/` ) ).toEqual( true );
});

test('CopyStuff() - Copy the code folder successfully', () => {
	CopyStuff('code');

	expect( Fs.existsSync( `${ testDir }/code/` ) ).toEqual( true );
});

test('CopyStuff() - Copy the folders to user defined folder-names', () => {
	SETTINGS.get().folder = {
		content: Path.normalize(`${ testDir }/2content/`),
		code: Path.normalize(`${ testDir }/c2ode/`),
		assets: Path.normalize(`${ testDir }/ass2ets/`),
	};

	CopyStuff('assets');
	CopyStuff('content');
	CopyStuff('code');

	expect( Fs.existsSync( `${ testDir }/2content/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/c2ode/` ) ).toEqual( true );
	expect( Fs.existsSync( `${ testDir }/ass2ets/` ) ).toEqual( true );
});
