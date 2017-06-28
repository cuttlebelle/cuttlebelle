/***************************************************************************************************************************************************************
 *
 * progress.js unit tests
 *
 * @file - src/progress.js
 *
 * Testing methods:
 * Progress
 **************************************************************************************************************************************************************/


import { Progress } from '../../src/progress';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Progress
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let amount = 100;
test('Progress.set - Set the amount correctly', () => {
	Progress.set( amount );

	expect( Progress.todo ).toBe( amount );
});


test('Progress.tick - Tick increases the amount correctly', () => {
	Progress.tick();

	expect( Progress.done ).toBe( 1 );
});


test('Progress.display - Tick increases the amount correctly', () => {
	process.stdout.write = jest.fn();

	Progress.display();

	expect( process.stdout.write.mock.calls.length ).toBe( 2 );
	expect( process.stdout.write.mock.calls[0][0] ).toBe(`\r\x1b[K`);
});


test('Progress.clear - clears the output correctly', () => {
	process.stdout.write = jest.fn();

	Progress.clear();

	expect( process.stdout.write.mock.calls.length ).toBe( 1 );
	expect( process.stdout.write.mock.calls[0][0] ).toBe(`\r\x1b[K`);
});
