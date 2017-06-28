/***************************************************************************************************************************************************************
 *
 * site.js unit tests
 *
 * @file - src/site.js
 *
 * Testing methods:
 * GetContent
 * GetLayout
 **************************************************************************************************************************************************************/


import { GetContent, GetLayout } from '../../src/site';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetContent
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetContent() - get all content from the mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/content/page1`),
		Path.normalize(`${ __dirname }/mocks/content/page2`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1/subsubpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page2/subpage1/subsubpage1/subsubsubpage1`),
		Path.normalize(`${ __dirname }/mocks/content/page3`),
	];

	expect( GetContent( Path.normalize(`${ __dirname }/mocks/content`) ) ).toEqual( expect.arrayContaining( folders ) );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetLayout
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetLayout() - get all content from the mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/src/layout.js`),
		Path.normalize(`${ __dirname }/mocks/src/layout1.js`),
		Path.normalize(`${ __dirname }/mocks/src/layout2.js`),
		Path.normalize(`${ __dirname }/mocks/src/layout3.js`),
		Path.normalize(`${ __dirname }/mocks/src/folder/layout.js`),
		Path.normalize(`${ __dirname }/mocks/src/folder/layout1.js`),
		Path.normalize(`${ __dirname }/mocks/src/folder/subfolder/layout.js`),
	];

	expect( GetLayout( Path.normalize(`${ __dirname }/mocks/src`) ) ).toEqual( expect.arrayContaining( folders ) );
});
