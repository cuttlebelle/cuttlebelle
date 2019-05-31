/***************************************************************************************************************************************************************
 *
 * site.js unit tests
 *
 * @file - src/site.js
 *
 * Tested methods:
 * GetContent
 * GetPartials
 * GetLayout
 *
 **************************************************************************************************************************************************************/


import { GetContent, GetPartials, GetLayout } from '../../src/site';
import { Path } from '../../src/path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetContent
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetContent() - Get all content from the mock folder', () => {
	const folders = [
		`/index`,
		`/page1`,
		`/page2`,
		`/page2/subpage1`,
		`/page2/subpage1/subsubpage1`,
		`/page2/subpage1/subsubpage1/subsubsubpage1`,
		`/page3`,
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
// GetPartials
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetPartials() - Get all partials from the mock folder', () => {
	const folders = [
		`/index/partial.md`,
		`/nonpage/partial.md`,
		`/page1/partial1.md`,
		`/page1/partial2.md`,
		`/page1/partial3.md`,
		`/page2/partial1.md`,
		`/page2/partial2.md`,
		`/page2/partial3.md`,
		`/page2/partial4.md`,
		`/page2/subpage1/subsubpage1/partial1.md`,
		`/page2/subpage1/subsubpage1/partial2.md`,
		`/page2/subpage1/subsubpage1/subsubsubpage1/partial.md`,
	];

	expect( GetPartials( Path.normalize(`${ __dirname }/mocks/content`) ) ).toEqual( expect.arrayContaining( folders ) );
});


test('GetPartials() - Get an info when the folder doesn’t exist', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	expect( GetPartials( Path.normalize(`${ __dirname }/mocks/content/non-existing/`) ) ).toEqual( expect.arrayContaining( [] ) );
	expect( console.info.mock.calls.length ).toBe( 1 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetLayout
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetLayout() - Get all content from the mock folder', () => {
	const folders = [
		`/layout.js`,
		`/layout1.js`,
		`/layout2.js`,
		`/layout3.js`,
		`/folder/layout.js`,
		`/folder/layout1.js`,
		`/folder/subfolder/layout.js`,
		`/page.js`,
	];

	expect( GetLayout( Path.normalize(`${ __dirname }/mocks/code`) ) ).toEqual( expect.arrayContaining( folders ) );
});


test('GetLayout() - Get an info when the folder doesn’t exist', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	expect( GetLayout( Path.normalize(`${ __dirname }/mocks/src/non-existing/`) ) ).toEqual( expect.arrayContaining( [] ) );
	expect( console.info.mock.calls.length ).toBe( 1 );
});
