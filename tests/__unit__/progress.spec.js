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
import Size from 'window-size';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Progress
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
let amount = 100;
test('Progress.set - Set the amount correctly', () => {
	Progress.set( amount );

	expect( Progress.todo ).toBe( amount );
});


test('Progress.tick - Tick increases the amount correctly', () => {
	process.stdout.write = jest.fn();

	Progress.tick();

	expect( Progress.done ).toBe( 1 );
});


test('Progress.display - Tick increases the amount correctly', () => {
	process.stdout.write = jest.fn();

	Progress.display();

	if( Size.width > 18 ) {
		expect( process.stdout.write.mock.calls.length ).toBe( 2 );
		expect( process.stdout.write.mock.calls[0][0] ).toBe(`\r\x1b[K`);
	}
	else {
		expect( process.stdout.write.mock.calls.length ).toBe( 0 );
	}
});


// Travis has issues with this test
// test('Progress.tick - Last tick clears the display', () => {
// 	process.stdout.write = jest.fn();

// 	Progress.done = amount - 1;

// 	Progress.tick();

// 	expect( process.stdout.write.mock.calls.length ).toBe( 3 );
// 	expect( process.stdout.write.mock.calls[0][0] ).toBe(`\r\x1b[K`);
// 	expect( process.stdout.write.mock.calls[2][0] ).toBe(`\r\x1b[K`);
// });


test('Progress.clear - clears the output correctly', () => {
	process.stdout.write = jest.fn();

	Progress.clear();

	expect( process.stdout.write.mock.calls.length ).toBe( 1 );
	expect( process.stdout.write.mock.calls[0][0] ).toBe(`\r\x1b[K`);
});
