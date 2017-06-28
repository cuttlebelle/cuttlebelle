/***************************************************************************************************************************************************************
 *
 * store.js unit tests
 *
 * @file - src/store.js
 *
 * Testing methods:
 * Store
 **************************************************************************************************************************************************************/


import { Store } from '../../src/store';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Store
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let result = {};

test('Store.set - Correctly merge variables into the store', () => {
	Store.set({ test: 'test' });
	result = { test: 'test' };
	expect( Store.all ).toMatchObject( result );

	Store.set({ test1: 'test1' });
	result = { test: 'test', test1: 'test1' };
	expect( Store.all ).toMatchObject( result );

	Store.set({ test: '2' });
	result = { test: '2', test1: 'test1' };
	expect( Store.all ).toMatchObject( result );
});


test('Store.get - Correctly get the store back', () => {
	expect( Store.get() ).toMatchObject( result );
});
