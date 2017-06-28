/***************************************************************************************************************************************************************
 *
 * helper.js unit tests
 *
 * @file - src/helper.js
 *
 * Testing methods:
 * Slug
 * ConvertHrtime
 * Style
 * Log
 *
 **************************************************************************************************************************************************************/


import { Slug, ConvertHrtime, Style, Log } from '../../src/helper';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Slug
//
// Slug() undefined
// Slug() special chars
// Slug() lowercasing
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Slug() - Non strings stay whatever they are', () => {
	expect( Slug( undefined ) ).toBe( undefined );
	expect( Slug( {} ) ).toMatchObject( {} );
});


test('Slug() - Special characters are removed', () => {
	expect( Slug(`string with "special 🔥  .chars $%^&*()\'\\ √¨üß" end`) ).toBe('string-with-special-chars-dollarand-uss-end');
	expect( Slug(`'"'"`) ).toBe('');
	expect( Slug(`µ√ç≈Ωåß∂πøˆ¨¥†®´∑œ¡™…£¢∞§¶•ªº–©≠≠‘’';/.,µ√µ≤≥÷˜uö¨süß~!@#$%%^^&*()_+`) )
		.toBe('cwassdpoyen-r-sumoetm-poundcentinfinity-ao-c-uosuss-dollarand-_-');
});


test('Slug() - Uppercase characters are transformed to lowercase', () => {
	expect( Slug('ALL UPPER and lower') ).toBe('all-upper-and-lower');
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// ConvertHrtime
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('ConvertHrtime() - Non arrays stay whatever they are', () => {
	expect( ConvertHrtime( undefined ) ).toBe( undefined );
	expect( ConvertHrtime( {} ) ).toMatchObject( {} );
	expect( ConvertHrtime( 'string' ) ).toBe( 'string' );
});


test('ConvertHrtime() - Measure time correctly', () => {
	expect( ConvertHrtime( [ 0, 555000000 ] ) ).toBe( '0.555' );
	expect( ConvertHrtime( [ 1, 585000000 ] ) ).toBe( '1.585' );
	expect( ConvertHrtime( [ 1, 585900000 ] ) ).toBe( '1.586' );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Style
//
// Style.parse
// Style.parse
// Style.parse
// Style.[color|bold]
// Style.[color] nesting
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Style.parse - undefined argument should return empty string', () => {
	expect( Style.parse( undefined ) ).toBe('');
});


test('Style.parse - start and end ansi code is correctly added', () => {
	expect( Style.parse( 'TEST', '666m', '777m' ) ).toBe('\u001B[666mTEST\u001b[777m');
});


test('Style.parse - start and end ansi code can be nested', () => {
	expect( Style.parse( `TEST ${ Style.parse( 'SUBTEST', '666m', '777m' ) } STRING`, '666m', '777m' ) )
		.toBe('\u001B[666mTEST \u001B[666mSUBTEST\u001B[666m STRING\u001b[777m');
});


test('function should return correct string and colour', () => {
	expect( Style.black('test black') ).toBe('\u001B[30mtest black\u001b[39m');
	expect( Style.red('test red') ).toBe('\u001B[31mtest red\u001b[39m');
	expect( Style.green('test green') ).toBe('\u001B[32mtest green\u001b[39m');
	expect( Style.yellow('test yellow') ).toBe('\u001B[33mtest yellow\u001b[39m');
	expect( Style.blue('test blue') ).toBe('\u001B[34mtest blue\u001b[39m');
	expect( Style.magenta('test magenta') ).toBe('\u001B[35mtest magenta\u001b[39m');
	expect( Style.cyan('test cyan') ).toBe('\u001B[36mtest cyan\u001b[39m');
	expect( Style.white('test white') ).toBe('\u001B[37mtest white\u001b[39m');
	expect( Style.gray('test gray') ).toBe('\u001B[90mtest gray\u001b[39m');
	expect( Style.bold('test bold') ).toBe('\u001B[1mtest bold\u001b[22m');
});


test('should be able to combine multiple strings of varying colours', () => {
	const test = Style.yellow(`yellow text ${ Style.green(`green text ${ Style.red(`red text`) } green text`) } yellow text`);

	expect( test ).toBe('\u001B[33myellow text \u001B[32mgreen text \u001B[31mred text\u001B[32m green text\u001B[33m yellow text\u001b[39m');
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Log
//
// Log.space
// Log.info
// Log.welcome
// Log.ok
// Log.done
// Log.verbose
// Log.verbose
// Log.error
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Log.space - Log.space should output a space', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.space();

	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
});


test('Log.info - Log.space should only be called the first time a Log function is run and should be formatted correctly', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.info(`test`);
	Log.info(`test2`);

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.info.mock.calls[0][0] ).toBe(` 🔔  INFO:    test`);
	expect( console.info.mock.calls[1][0] ).toBe(` 🔔  INFO:    test2`);
});


test('Log.welcome - Log.welcome should should be formatted correctly', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.output = false;
	Log.welcome(`test`);
	Log.welcome(`test2`);

	expect( console.log.mock.calls.length ).toBe( 3 );
	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.log.mock.calls[1][0] ).toBe(` 🐙           \u001B[1mtest\u001b[22m`);
	expect( console.log.mock.calls[2][0] ).toBe(` 🐙           \u001B[1mtest2\u001b[22m`);
});


test('Log.ok - Log.space should should be formatted correctly', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.output = false;
	Log.ok(`test`);
	Log.ok(`test2`);

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.info.mock.calls[0][0] ).toBe(` ✔  \u001B[32mOK:\u001b[39m      \u001B[32mtest\u001b[39m`);
	expect( console.info.mock.calls[1][0] ).toBe(` ✔  \u001B[32mOK:\u001b[39m      \u001B[32mtest2\u001b[39m`);
});


test('Log.done - Log.done should should be formatted correctly', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.output = false;
	Log.done(`test`);
	Log.done(`test2`);

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.info.mock.calls[0][0] ).toBe(` 🚀           \u001B[32m\u001B[1mtest\u001b[22m\u001b[39m`);
	expect( console.info.mock.calls[1][0] ).toBe(` 🚀           \u001B[32m\u001B[1mtest2\u001b[22m\u001b[39m`);
});


test('Log.verbose - Log.verbose should should be formatted correctly', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.output = false;
	Log.verboseMode = true;
	Log.verbose(`test`);
	Log.verbose(`test2`);

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.info.mock.calls[0][0] ).toBe(` 😬  \u001B[90mVERBOSE: test\u001b[39m`);
	expect( console.info.mock.calls[1][0] ).toBe(` 😬  \u001B[90mVERBOSE: test2\u001b[39m`);
});


test('Log.verbose - Log.verbose should log nothing with verboseMode false', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	Log.output = false;
	Log.verboseMode = false;
	Log.verbose(`test`);
	Log.verbose(`test2`);

	expect( console.log.mock.calls.length ).toBe( 0 );
	expect( console.info.mock.calls.length ).toBe( 0 );
});


test('Log.error - Log.error should should be formatted correctly', () => {
	console.log = jest.fn();
	console.error = jest.fn();

	Log.output = false;
	Log.verboseMode = true;
	Log.error(`test`);
	Log.error(`test2`);

	expect( console.log.mock.calls[0][0] ).toBe(`\n`);
	expect( console.error.mock.calls[0][0] ).toBe(` 🔥  \u001B[31mERROR:   test\u001b[39m`);
	expect( console.error.mock.calls[1][0] ).toBe(` 🔥  \u001B[31mERROR:   test2\u001b[39m`);
});
