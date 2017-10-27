/***************************************************************************************************************************************************************
 *
 * render.js unit tests
 *
 * @file - src/render.js
 *
 * Tested methods:
 * RelativeURL
 * RenderReact
 * RenderFile
 * RenderPartial
 * PreRender
 * RenderAssets
 *
 **************************************************************************************************************************************************************/


import { RelativeURL, RenderReact, RenderFile, RenderPartial, PreRender, RenderAssets } from '../../src/render';
import { CreateDir, RemoveDir } from '../../src/files';
import { Progress } from '../../src/progress';
import { SETTINGS } from '../../src/settings';
import { Pages } from '../../src/pages';
import React from 'react';
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const testDir = `${ __dirname }/temp2`;



//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RelativeURL
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RelativeURL() - Resolve two URLs to a relative path', () => {
	expect( RelativeURL( '/path/to', '/path' ) )                   .toBe( 'to' );
	expect( RelativeURL( '/path/to', '/' ) )                       .toBe( 'path/to' );
	expect( RelativeURL( '/path/to', '/path2' ) )                  .toBe( '../path/to' );
	expect( RelativeURL( '/path/to', '/path2/more/deep/yay/wow' ) ).toBe( '../../../../../path/to' );
	expect( RelativeURL( '/path/to', '/path/to/deepter' ) )        .toBe( '..' );
	expect( RelativeURL( '/path/to', '/path/to' ) )                .toBe( '.' );
	expect( RelativeURL( '/path/to', '/path/to/more/pages' ) )     .toBe( '../..' );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RenderReact
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RenderReact() - Render react components correctly', () => {
	const file1 = Path.normalize(`${ __dirname }/mocks/react1`);
	const props1 = { title: 'Hello', _body: 'World!' };
	const HTML1 = '<article><h2>Hello</h2><div>World!</div></article>';
	expect( RenderReact( file1, props1 ) ).toBe( HTML1 );

	const file2 = Path.normalize(`${ __dirname }/mocks/react2`);
	const props2 = {
		title: 'Hello World',
		_nav: {
			index: 'index',
			page1: {
				'page1/subpage1': 'page1/subpage1',
				'page1/subpage2': 'page1/subpage2',
				'page1/subpage3': 'page1/subpage3',
				'page1/subpage4': {
					'page1/subpage4/subsubpage1': 'page1/subpage4/subsubpage1',
					'page1/subpage4/subsubpage2': 'page1/subpage4/subsubpage2',
					'page1/subpage4/subsubpage3': 'page1/subpage4/subsubpage3'
				}
			},
			page2: 'page2'
		},
		_pages: {
			index: {
				url: '/',
				title: 'Homepage',
				main: ['dfsfsdf', 'partial1.md', '/shared/component2.md'],
				aside: 'partial2.md',
				test: { test: [Object] }
			},
			page1: { url: '/page1', title: 'Page 1', main: ['dfsfsdf'] },
			'page1/subpage1': {
				url: '/page1/subpage1',
				title: 'Subpage 1',
				main: ['partial1.md', 'partial2.md']
			},
			'page1/subpage2': {
				url: '/page1/subpage2',
				title: 'Subpage 2',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage3': {
				url: '/page1/subpage3',
				title: 'Subpage 3',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage4': { url: '/page1/subpage4', title: 'Subpage 4', main: 'Yay!' },
			'page1/subpage4/subsubpage1': {
				url: '/page1/subpage4/subsubpage1',
				title: 'SubSubpage 1',
				main: ['partial1.md', 'partial2.md']
			},
			'page1/subpage4/subsubpage2': {
				url: '/page1/subpage4/subsubpage2',
				title: 'SubSubpage 2',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage4/subsubpage3': {
				url: '/page1/subpage4/subsubpage3',
				title: 'SubSubpage 3',
				main: 'ysdyasdyasydad'
			},
			page2: {
				url: '/page2',
				title: 'Page 2',
				main: ['partial1.md', '/shared/component2.md', 'partial2.md']
			}
		},
		_ID: 'index',
		_relativeURL: ( URL, ID ) => Path.relative(`/`, URL),
		main: 'Main content',
		aside: 'Aside content',
	};
	const HTML2 = '<html><head><title>Hello World</title></head><body><main><h1>Hello World</h1><nav><ul class=\"navigation navigation--level-0\">' +
		'<li class=\"navigation__item\"><span class=\"navigation__item__span\">Homepage</span></li><li class=\"navigation__item navigation__item--has-nested\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1\">Page 1</a><ul class=\"navigation navigation--level-1\"><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage1\">Subpage 1</a></li><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage2\">Subpage 2</a></li><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage3\">Subpage 3</a></li><li class=\"navigation__item navigation__item--has-nested\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage4\">Subpage 4</a><ul class=\"navigation navigation--level-2\"><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage4/subsubpage1\">SubSubpage 1</a></li><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage4/subsubpage2\">SubSubpage 2</a></li><li class=\"navigation__item\">' +
		'<a class=\"navigation__item__anchor\" href=\"page1/subpage4/subsubpage3\">SubSubpage 3</a></li></ul></li></ul></li>' +
		'<li class=\"navigation__item\"><a class=\"navigation__item__anchor\" href=\"page2\">Page 2</a></li></ul></nav><div>Main content</div></main>' +
		'<aside>Aside content</aside></body></html>';
	expect( RenderReact( file2, props2 ) ).toBe( HTML2 );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RenderFile
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RenderFile() - Generate the right HTML from a mock index.yml file WITHOUT partials', () => {
	CreateDir( testDir );

	SETTINGS.get().folder.code = Path.normalize(`${ __dirname }/mocks/code/`);

	const content = `
title: Title
header:
  - Header
main:
  - Hello world
footer:
  - Footer
`;

	const fixture = '<html><head><title>Cuttlebelle - Title</title><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="ie=edge"/>' +
		'<meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/assets/css/site.css"/></head><body><div class="top">' +
		'<header role="banner">Header</header>' +
		'<main>Hello world' +
			'props: ' +
			'- _ID: subpage' +
			'- _parents: [&quot;index&quot;,&quot;subpage&quot;]' +
			'- _body: <div></div>' +
			'- _pages: {&quot;subpage&quot;:{&quot;url&quot;:&quot;/subpage&quot;,&quot;title&quot;:&quot;Title&quot;,&quot;header&quot;:[&quot;Header&quot;]' +
			',&quot;main&quot;:[&quot;Hello world&quot;],&quot;footer&quot;:[&quot;Footer&quot;]}}' +
			'- _nav: []' +
			'- _store: {&quot;test&quot;:&quot;done&quot;}' +
			'- _relativeURL: ../subpage' +
			'- _parseMD: <div><h1 id="headline">headline</h1>\n<p><strong>bold</strong> yay!</p>\n</div>' +
		'</main></div><footer>Footer</footer></body></html>';

	return RenderFile( content, 'subpage/index.yml' ).then( result => {
		RemoveDir( testDir );

		expect( result ).toBe( fixture );
	})
});


test('RenderFile() - Generate the right HTML from a mock index.yml file WITH partials', () => {
	CreateDir( testDir );

	SETTINGS.get().folder.code = Path.normalize(`${ __dirname }/mocks/code/`);
	SETTINGS.get().folder.content = Path.normalize(`${ __dirname }/mocks/content/`);

	const content = `
title: Title
header:
  - Header
main:
  - /nonpage/partial.md
footer:
  - Footer
`;

	const fixture = '<html><head><title>Cuttlebelle - Title</title><meta charSet="utf-8"/><meta http-equiv="x-ua-compatible" content="ie=edge"/>' +
		'<meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/assets/css/site.css"/></head><body><div class="top">' +
		'<header role="banner">Header</header>' +
		'<main>' +
			'<div><div class="textwrapper"><div><h1 id="test">test</h1>\n</div></div></div>' +
			'props: ' +
			'- _ID: subpage' +
			'- _parents: [&quot;index&quot;,&quot;subpage&quot;]' +
			'- _body: <div></div>' +
			'- _pages: {&quot;subpage&quot;:{&quot;url&quot;:&quot;/subpage&quot;,&quot;title&quot;:&quot;Title&quot;,&quot;header&quot;:[&quot;Header&quot;],&quot;main&quot;:[&quot;/nonpage/partial.md&quot;],&quot;footer&quot;:[&quot;Footer&quot;]}}' +
			'- _nav: []' +
			'- _store: {&quot;test&quot;:&quot;done&quot;}' +
			'- _relativeURL: ../subpage' +
			'- _parseMD: <div><h1 id="headline">headline</h1>\n<p><strong>bold</strong> yay!</p>\n</div>' +
		'</main></div><footer>Footer</footer></body></html>';

	return RenderFile( content, 'subpage/index.yml' ).then( result => {
		RemoveDir( testDir );

		expect( result ).toBe( fixture );
	})
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RenderPartial
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RenderPartial() - We should not change non-partial strings', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	const partial = 'non partial string';

	return RenderPartial( partial, Path.normalize(`${ __dirname }/mocks/content/nonpage`), [] )
		.then( ( result ) => {
			expect( result ).toEqual( partial );
	});
});


test('RenderPartial() - Return a rendered object for partials', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	const HTML = '{\"type\":\"div\",\"key\":\"cuttlebelleIDpartial-md-0\",\"ref\":null,\"props\":{\"dangerouslySetInnerHTML\":' +
		'{\"__html\":\"<div class=\\\"textwrapper\\\"><div><h1 id=\\\"test\\\">test</h1>\\n</div></div>\"}},\"_owner\":null,\"_store\":{}}';

	return RenderPartial( 'partial.md', Path.normalize(`${ __dirname }/mocks/content/nonpage/index.yml`), [] )
		.then( ( result ) => {
			expect( JSON.stringify( result.partial ) ).toBe( HTML );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// PreRender
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('PreRender() - Resolve with empty object if no content was found', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	SETTINGS.get().folder.content = Path.normalize(`${ __dirname }/mocks/content/NonExistent-Dir`);

	return PreRender()
		.then( ( result ) => {
			expect( result.content.length ).toEqual( 0 );
			expect( result.layout.length ).toEqual( 0 );
	});
});


test('PreRender() - Return the correct content and layout data', () => {
	console.log = jest.fn();
	console.info = jest.fn();

	SETTINGS.get().folder.content = Path.normalize(`${ __dirname }/mocks/content`);
	SETTINGS.get().folder.code = Path.normalize(`${ __dirname }/mocks/code`);

	const content = [
		'/index',
		'/page1',
		'/page2',
		'/page2/subpage1',
		'/page2/subpage1/subsubpage1',
		'/page2/subpage1/subsubpage1/subsubsubpage1',
		'/page3',
	];

	const layout = [
		'/folder/layout.js',
		'/folder/layout1.js',
		'/folder/subfolder/layout.js',
		'/layout.js',
		'/layout1.js',
		'/layout2.js',
		'/layout3.js',
		'/page.js',
		'/partial.js',
	];

	const pages = [
		'subpage',
		'/index',
		'/page1',
		'/page2',
		'/page2/subpage1',
		'/page2/subpage1/subsubpage1',
		'/page2/subpage1/subsubpage1/subsubsubpage1',
		'/page3',
	];

	return PreRender()
		.then( ( result ) => {
			expect( result.content ).toEqual( expect.arrayContaining( content ) );
			expect( result.layout ).toEqual( expect.arrayContaining( layout ) );
			expect( Progress.todo ).toEqual( content.length );
			expect( Object.keys( Pages.all ) ).toEqual( expect.arrayContaining( pages ) );
	});
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RenderFile
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RenderAssets() - Copy all nested assets files to its destination', () => {
	return RenderAssets( Path.normalize(`${ __dirname }/mocks/assets/`), testDir )
		.then( () => {
			expect( Fs.existsSync( Path.normalize(`${ testDir }/style.css`) ) ).toEqual( true );
			expect( Fs.existsSync( Path.normalize(`${ testDir }/test/style2.css`) ) ).toEqual( true );

			RemoveDir( testDir );
	});
});


test('RenderAssets() - Cannot copy files from non existent directory', () => {
	return RenderAssets( Path.normalize(`${ __dirname }/mocks/assets/NonExistent-Dir/`), `${ testDir }/NonExistent/` )
		.then( () => {
			expect( Fs.existsSync( `${ testDir }/NonExistent/` ) ).toEqual( false );
	});
});
