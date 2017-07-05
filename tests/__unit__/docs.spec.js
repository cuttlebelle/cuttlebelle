/***************************************************************************************************************************************************************
 *
 * docs.js unit tests
 *
 * @file - src/docs.js
 *
 * Testing methods:
 * Ipsum
 * GetCategories
 * GetCss
 * CreateCategory
 * CreateIndex
 * ParseComponent
 * BuildPropsYaml
 * BuildHTML
 * ParseExample
 * ReplaceMagic
 * MakePartials
 * MakeIpsum
 * vocabulary
 **************************************************************************************************************************************************************/


import {
	Ipsum,
	GetCategories,
	GetCss,
	CreateCategory,
	CreateIndex,
	ParseComponent,
	BuildPropsYaml,
	BuildHTML,
	ParseExample,
	ReplaceMagic,
	MakePartials,
	MakeIpsum,
	vocabulary
} from '../../src/docs';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Ipsum
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Ipsum - Is a string', () => {
	expect( typeof Ipsum ).toBe( 'string' );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetCategories
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetCategories() - Gets all categories from an array', () => {
	expect( GetCategories( ['one/two.js'] ) ).toEqual( expect.arrayContaining( ['one'] ) );
	expect( GetCategories( ['index/one/two.js'] ) ).toEqual( expect.arrayContaining( ['index/one'] ) );
	expect( GetCategories( ['one/two.js', 'three/four.js', 'one.js'] ) ).toEqual( expect.arrayContaining( ['one', 'three', '.'] ) );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetCss
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('GetCss() - Gets all css files from mock folder', () => {
	const folders = [
		Path.normalize(`${ __dirname }/mocks/assets/nesting/nested/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/nesting/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/test/style.css`),
		Path.normalize(`${ __dirname }/mocks/assets/test/style2.css`),
	];

	expect( GetCss( Path.normalize(`${ __dirname }/mocks/assets`) ) ).toEqual( expect.arrayContaining( folders ) );
});
