/***************************************************************************************************************************************************************
 *
 * files.js unit tests
 *
 * @file - src/files.js
 *
 * Testing methods:
 * CreateDir
 * CreateFile
 * CopyFiles
 * ReadFile
 * RemoveDir
 **************************************************************************************************************************************************************/


import { CreateFile, CreateDir, CopyFiles, ReadFile, RemoveDir } from '../../src/files';
import Log from '../../src/helper';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const content = `This is the test content`;
const testDir = `${ __dirname }/temp`;


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CreateDir
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('CreateDir() - Creating a directory correctly', () => {
	CreateDir( `${ testDir }/CreateFile/CreateDir/` );

	expect( Fs.existsSync( `${ testDir }/CreateFile/CreateDir/` ) ).toEqual( true );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CreateFile
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('CreateFile() - Promisified writing a file correctly', () => {
	return CreateFile( `${ testDir }/CreateFile/test-01.txt`, content )
		.then( () => {
			expect( Fs.existsSync( `${ testDir }/CreateFile/test-01.txt` ) ).toEqual( true );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// CopyFiles
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('CopyFiles() - Copy multiple files and nested directories', () => {
	return CopyFiles( `${ testDir }/CreateFile/`, `${ testDir }/CopyFile/` )
		.then( () => {
			expect( Fs.existsSync( `${ testDir }/CopyFile/` ) ).toEqual( true );
			expect( Fs.existsSync( `${ testDir }/CopyFile/test-01.txt` ) ).toEqual( true );
	});
});


test('CopyFiles() - Cannot copy files from non existent directory', () => {
	return CopyFiles( `${ testDir }/NonExistent-Dir/`, `${ testDir }/NonExistent/` )
		.then( () => {
			expect( Fs.existsSync( `${ testDir }/NonExistent/` ) ).toEqual( false );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ReadFile
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ReadFile() - Promisified reading a file correctly', () => {
	return ReadFile( `${ testDir }/CreateFile/test-01.txt` )
		.then( data => {
			expect( data ).toEqual( content );
	});
});


test('ReadFile() - Cannot read file that is non existent', () => {
	console.log = jest.fn();
	console.error = jest.fn();

	return ReadFile( `${ testDir }/NonExistent/test-01.txt` )
		.then( () => {}, error => {
			expect( error.errno ).toBe( -2 );
			expect( error.code ).toBe( `ENOENT` );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RemoveDir
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RemoveDir() - Removing a non existent directory', () => {
	RemoveDir( `${ testDir }/NonExistent/CreateDir/` );
	expect( Fs.existsSync( `${ testDir }/NonExistent/CreateDir/` ) ).toEqual( false );

	RemoveDir( `${ testDir }` );
	expect( Fs.existsSync( `${ testDir }` ) ).toEqual( false );
});
