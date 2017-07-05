/***************************************************************************************************************************************************************
 *
 * nav.js unit tests
 *
 * @file - src/nav.js
 *
 * Testing methods:
 * ToDepth
 * ToNested
 * Nav
 **************************************************************************************************************************************************************/


import { ToDepth, ToNested, Nav } from '../../src/nav';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ToDepth
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ToDepth() - Non strings stay whatever they are', () => {
	expect( ToDepth( undefined ) ).toBe( undefined );
	expect( ToDepth( [] ) ).toEqual( expect.arrayContaining( [] ) );
	expect( ToDepth( {} ) ).toMatchObject( {} );
});


test('ToDepth() - Should split path into array correctly', () => {
	let nested = {};
	ToDepth('first/second/last', nested);
	let match = { first: { 'first/second': { 'first/second/last': 'first/second/last' } } };
	expect( nested ).toMatchObject( match );

	ToDepth('first', nested);
	expect( nested ).toMatchObject( match );

	ToDepth('first/second/more', nested);
	match = { first: { 'first/second': { 'first/second/last': 'first/second/last', 'first/second/more': 'first/second/more' } } };
	expect( nested ).toMatchObject( match );

	ToDepth('another/one', nested);
	match = {
		first: { 'first/second': { 'first/second/last': 'first/second/last', 'first/second/more': 'first/second/more' } },
		another: { 'another/one': 'another/one' }
	};
	expect( nested ).toMatchObject( match );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ToNested
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ToNested() - Non arrays stay whatever they are', () => {
	expect( ToNested( undefined ) ).toBe( undefined );
	expect( ToNested( 'string' ) ).toBe( 'string' );
	expect( ToNested( {} ) ).toMatchObject( {} );
});


test('ToNested() - Should split path into array correctly', () => {
	const nested = [ 'one/two', 'one', 'three' ];
	const match = { index: { one: { 'one/two': 'one/two' }, three: 'three' } };
	expect( ToNested( nested ) ).toMatchObject( match );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Nav
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
Nav.set( [ 'one', 'one/two', 'three' ] );
const match = { index: { one: { 'one/two': 'one/two' }, three: 'three' } };

test('Nav.set - Sets the nav correctly from an array', () => {
	expect( Nav.all ).toMatchObject( match );
});


test('Nav.set - Gets the latest nav correctly', () => {
	expect( Nav.get() ).toMatchObject( match );
});
