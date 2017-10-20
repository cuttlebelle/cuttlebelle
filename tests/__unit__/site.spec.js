/***************************************************************************************************************************************************************
 *
 * site.js unit tests
 *
 * @file - src/site.js
 *
 * Tested methods:
 * GetContent
 * GetLayout
 *
 **************************************************************************************************************************************************************/


import { GetContent, GetLayout } from '../../src/site';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetContent
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetContent() - Get all content from the mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/content/index`),
		Path.normalize(`${ __dirname }/mocks/content/page1`),
		Path.normalize(`${ __dirname }/mocks/content/page2`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1/subsubpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1/subsubpage1/subsubsubpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page3`),
	];

	expect( GetContent( Path.normalize(`${ __dirname }/mocks/content`) ) ).toEqual( expect.arrayContaining( folders ) );
});


test('GetContent() - Get an info when the folder doesn’t exist', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	expect( GetContent( Path.normalize(`${ __dirname }/mocks/content/non-existing/`) ) ).toEqual( expect.arrayContaining( [] ) );
	expect( console.info.mock.calls.length ).toBe( 1 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetLayout
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetLayout() - Get all content from the mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/code/layout.js`),
		Path.normalize(`${ __dirname }/mocks/code/layout1.js`),
		Path.normalize(`${ __dirname }/mocks/code/layout2.js`),
		Path.normalize(`${ __dirname }/mocks/code/layout3.js`),
		Path.normalize(`${ __dirname }/mocks/code/folder/layout.js`),
		Path.normalize(`${ __dirname }/mocks/code/folder/layout1.js`),
		Path.normalize(`${ __dirname }/mocks/code/folder/subfolder/layout.js`),
		Path.normalize(`${ __dirname }/mocks/code/page.js`),
	];

	expect( GetLayout( Path.normalize(`${ __dirname }/mocks/code`) ) ).toEqual( expect.arrayContaining( folders ) );
});


test('GetLayout() - Get an info when the folder doesn’t exist', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	expect( GetLayout( Path.normalize(`${ __dirname }/mocks/src/non-existing/`) ) ).toEqual( expect.arrayContaining( [] ) );
	expect( console.info.mock.calls.length ).toBe( 1 );
});
