/***************************************************************************************************************************************************************
 *
 * watch.js unit tests
 *
 * @file - src/watch.js
 *
 * Testing methods:
 * Layouts
 **************************************************************************************************************************************************************/


import { Layouts } from '../../src/watch';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Layouts
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let result = {};

test('Layouts.set - Correctly merge pages into our layout memory', () => {
	Layouts.set( 'page1', 'layout1' );
	result = { layout1: [ 'page1' ] };
	expect( Layouts.all ).toMatchObject( result );

	Layouts.set( 'page2', 'layout1' );
	result = { layout1: [ 'page1', 'page2' ] };
	expect( Layouts.all ).toMatchObject( result );

	Layouts.set( 'page3', 'layout2' );
	result = { layout1: [ 'page1', 'page2' ], layout2: [ 'page3' ] };
	expect( Layouts.all ).toMatchObject( result );
});


test('Layouts.get - Correctly get the layout back', () => {
	expect( Layouts.get() ).toMatchObject( result );
});
