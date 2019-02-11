/***************************************************************************************************************************************************************
 *
 * path.js unit tests
 *
 * @file - src/path.js
 *
 * Tested methods:
 * Path
 *
 **************************************************************************************************************************************************************/


import { Path } from '../../src/path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Path
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Path() - Needs to normalize all paths regardless of OS', () => {
	expect( Path.normalize('C:\\home\\path') ).toEqual('C:/home/path');
	expect( Path.normalize('C:\\home\\path/../subpath') ).toEqual('C:/home/subpath');
	expect( Path.normalize('C:/home/path//to/location') ).toEqual('C:/home/path/to/location');
	expect( Path.normalize('./relative/') ).toEqual('relative/');
	expect( Path.normalize('C:\\Users\\IEUser\\Desktop\\tests\\site1//../../dist/index.js') )
		.toEqual('C:/Users/IEUser/Desktop/dist/index.js');
});
