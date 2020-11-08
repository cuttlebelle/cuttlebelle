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
import { Path } from '../../src/path';
import React from 'react';
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
	expect( RelativeURL( '/path/to', '/path/to/deeper' ) )         .toBe( '..' );
	expect( RelativeURL( '/path/to', '/path/to' ) )                .toBe( '.' );
	expect( RelativeURL( '/path/to', '/path/to/more/pages' ) )     .toBe( '../..' );

	// testing https://github.com/nodejs/node/issues/28549
	expect( RelativeURL( '/', '/page1' ) )                            .toBe( '..' );
	expect( RelativeURL( '/', '/page1/page2/foo' ) )                  .toBe( '../../..' );
	expect( RelativeURL( '/page1/', '/page1/page2/foo' ) )            .toBe( '../..' );
	expect( RelativeURL( '/page1/page2/', '/page1/page2/foo' ) )      .toBe( '..' );
});


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// RenderReact
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('RenderReact() - Render react components from source correctly', () => {
	const file1 = Path.normalize(`${ __dirname }/mocks/doesnotexist`);
	const props1 = { title: 'Hello', _body: 'World!' };
	const jsx = `
		import React from "react";

		export default ( page ) => (
			<main>
				<h1>{ page.title }</h1>
				<div>{ page.title } { page._body }</div>
			</main>
		);`;
	const HTML1 = '<main><h1>Hello</h1><div>Hello World!</div></main>';
	return RenderReact( file1, props1, jsx ).then( result => { expect( result ).toBe( HTML1 ) });
});

test('RenderReact() - Render react components from file correctly', () => {
	const file1 = Path.normalize(`${ __dirname }/mocks/react1`);
	const props1 = { title: 'Hello', _body: 'World!' };
	const HTML1 = '<article><h2>Hello</h2><div>World!</div></article>';
	return RenderReact( file1, props1 ).then( result => { expect( result ).toBe( HTML1 ) });
});

test('RenderReact() - Render cuttlebelle react from file components correctly 1', () => {
	const file1 = Path.normalize(`${ __dirname }/mocks/react1`);
	const props1 = { title: 'Hello', _body: 'World!' };
	const HTML1 = '<article><h2>Hello</h2><div>World!</div></article>';
	return RenderReact( file1, props1 ).then( result => { expect( result ).toBe( HTML1 ) });
});

test('RenderReact() - Render cuttlebelle react from file components correctly 2', () => {
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
				_url: '/',
				title: 'Homepage',
				main: ['dfsfsdf', 'partial1.md', '/shared/component2.md'],
				aside: 'partial2.md',
				test: { test: [Object] }
			},
			page1: { _url: '/page1', title: 'Page 1', main: ['dfsfsdf'] },
			'page1/subpage1': {
				_url: '/page1/subpage1',
				title: 'Subpage 1',
				main: ['partial1.md', 'partial2.md']
			},
			'page1/subpage2': {
				_url: '/page1/subpage2',
				title: 'Subpage 2',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage3': {
				_url: '/page1/subpage3',
				title: 'Subpage 3',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage4': { _url: '/page1/subpage4', title: 'Subpage 4', main: 'Yay!' },
			'page1/subpage4/subsubpage1': {
				_url: '/page1/subpage4/subsubpage1',
				title: 'SubSubpage 1',
				main: ['partial1.md', 'partial2.md']
			},
			'page1/subpage4/subsubpage2': {
				_url: '/page1/subpage4/subsubpage2',
				title: 'SubSubpage 2',
				main: 'ysdyasdyasydad'
			},
			'page1/subpage4/subsubpage3': {
				_url: '/page1/subpage4/subsubpage3',
				title: 'SubSubpage 3',
				main: 'ysdyasdyasydad'
			},
			page2: {
				_url: '/page2',
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
	return RenderReact( file2, props2 ).then( result => { expect( result ).toBe( HTML2 ) });
});

test('RenderReact() - Render react class components with static async getInitialProps method', () => {
	const file = Path.normalize(`${ __dirname }/mocks/doesnotexist`);
	const props = {};
	const jsx = `
		import React, { Component } from 'react';

		class GetData extends Component {
			static async getInitialProps() {
				const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
				await Sleep( 1000 );
				return { data: 'set' };
			}

			render() {
				return (
					<div>
						My Data: { this.props.data }
					</div>
				);
			}
		}

		export default GetData;`;
	const HTML = '<div>My Data: set</div>';
	return RenderReact( file, props, jsx ).then( result => { expect( result ).toBe( HTML ) });
});

test('RenderReact() - Render react class components with static sync getInitialProps method', () => {
	console.log = jest.fn();
	console.info = jest.fn();
	const file = Path.normalize(`${ __dirname }/mocks/doesnotexist`);
	const props = {};
	const jsx = `
		import React, { Component } from 'react';

		class GetData extends Component {
			static getInitialProps() {
				return { data: 'set' };
			}

			render() {
				return (
					<div>
						My Data: { this.props.data }
					</div>
				);
			}
		}

		export default GetData;`;
	const HTML = '<div>My Data: set</div>';
	return RenderReact( file, props, jsx ).then( result => {
		expect( result ).toBe( HTML );
		expect( console.info.mock.calls[0][0] ).toContain('getInitialProps');
	});
});

test('RenderReact() - Render react functional components with async getInitialProps method', () => {
	const file = Path.normalize(`${ __dirname }/mocks/doesnotexist`);
	const props = {};
	const jsx = `
		import React from 'react';

		export default function GetData( props ) {
			return (
				<div>
					My Data: { props.data }
				</div>
			);
		}

		GetData.getInitialProps = async function( props ) {
			const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
			await Sleep( 1000 );
			return { data: 'set' };
		}`;
	const HTML = '<div>My Data: set</div>';
	return RenderReact( file, props, jsx ).then( result => { expect( result ).toBe( HTML ) });
});

test('RenderReact() - Render react functional components with sync getInitialProps method', () => {
	console.log = jest.fn();
	console.info = jest.fn();
	const file = Path.normalize(`${ __dirname }/mocks/doesnotexist`);
	const props = {};
	const jsx = `
		import React from 'react';

		export default function GetData( props ) {
			return (
				<div>
					My Data: { props.data }
				</div>
			);
		}

		GetData.getInitialProps = function( props ) {
			return { data: 'set' };
		}`;
	const HTML = '<div>My Data: set</div>';
	return RenderReact( file, props, jsx ).then( result => {
		expect( result ).toBe( HTML );
		expect( console.info.mock.calls[0][0] ).toContain('getInitialProps');
	});
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
			'- _body: <cuttlebellesillywrapper></cuttlebellesillywrapper>' +
			'- _pages: {&quot;subpage&quot;:{&quot;title&quot;:&quot;Title&quot;,&quot;header&quot;:[&quot;Header&quot;]' +
			',&quot;main&quot;:[&quot;Hello world&quot;],&quot;footer&quot;:[&quot;Footer&quot;],&quot;_url&quot;:&quot;/subpage&quot;}}' +
			'- _nav: []' +
			'- _store: {&quot;test&quot;:&quot;done&quot;}' +
			'- _relativeURL: ../subpage' +
			'- _parseMD: <cuttlebellesillywrapper><h1 id="headline">headline</h1>\n<p><strong>bold</strong> yay!</p>\n</cuttlebellesillywrapper>' +
		'</main></div><footer>Footer</footer></body></html>';

	return RenderFile( content, 'subpage/index.yml' ).then( result => {
		RemoveDir([ testDir ]);

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
			'<cuttlebellesillywrapper><div class="textwrapper"><cuttlebellesillywrapper><h1 id="test">test</h1>\n</cuttlebellesillywrapper></div>' +
			'</cuttlebellesillywrapper>props: ' +
			'- _ID: subpage' +
			'- _parents: [&quot;index&quot;,&quot;subpage&quot;]' +
			'- _body: <cuttlebellesillywrapper></cuttlebellesillywrapper>' +
			'- _pages: {&quot;subpage&quot;:{&quot;title&quot;:&quot;Title&quot;,&quot;header&quot;:[&quot;Header&quot;]' +
			',&quot;main&quot;:[&quot;/nonpage/partial.md&quot;],&quot;footer&quot;:[&quot;Footer&quot;],&quot;_url&quot;:&quot;/subpage&quot;}}' +
			'- _nav: []' +
			'- _store: {&quot;test&quot;:&quot;done&quot;}' +
			'- _relativeURL: ../subpage' +
			'- _parseMD: <cuttlebellesillywrapper><h1 id="headline">headline</h1>\n<p><strong>bold</strong> yay!</p>\n</cuttlebellesillywrapper>' +
		'</main></div><footer>Footer</footer></body></html>';

	return RenderFile( content, 'subpage/index.yml' ).then( result => {
		RemoveDir([ testDir ]);

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

	const HTML = '{\"type\":\"cuttlebellesillywrapper\",\"key\":\"cuttlebelleIDpartial-md-0\",\"ref\":null,\"props\":{\"dangerouslySetInnerHTML\":' +
		'{\"__html\":\"<div class=\\\"textwrapper\\\"><cuttlebellesillywrapper><h1 id=\\\"test\\\">test</h1>\\n</cuttlebellesillywrapper></div>\"}},' +
		'\"_owner\":null,\"_store\":{}}';

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

			RemoveDir([ testDir ]);
	});
});

test('RenderAssets() - Copying non existent directory will create an empty folder in the destination', () => {
	return RenderAssets( Path.normalize(`${ __dirname }/mocks/assets/NonExistent-Dir/`), `${ testDir }/NonExistent/` )
		.then( () => {
			expect( Fs.existsSync( `${ testDir }/NonExistent/` ) ).toEqual( true );
	});
});
