/***************************************************************************************************************************************************************
 *
 * render.js unit tests
 *
 * @file - src/render.js
 *
 * Tested methods:
 * RenderReact
 * RenderFile
 *
 **************************************************************************************************************************************************************/


import { RenderReact, RenderFile } from '../../src/render';
import { CreateDir, RemoveDir } from '../../src/files';
import { SETTINGS } from '../../src/settings';
import React from 'react';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Globals
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const testDir = `${ __dirname }/temp`;


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
test('RenderFile() - Generate the right HTML from a mock file', () => {
	CreateDir( testDir );

	SETTINGS.get().folder = {
		// cwd: Path.normalize(`${ __dirname }/mocks/`),
		// content: Path.normalize(`${ __dirname }/mocks/content/`),
		code: Path.normalize(`${ __dirname }/mocks/code/`),
		// assets: Path.normalize(`${ __dirname }/mocks/assets/`),
		// site: Path.normalize(`${ __dirname }/mocks/site/`),
		// docs: Path.normalize(`${ __dirname }/mocks/docs/`),
	};

	const content = `
title: Title
header:
  - Header
main:
  - Hello world
footer:
  - Footer
`;

	const fixture = '<html><head><title>Cuttlebelle - Title</title><meta charset="utf-8"/><meta content="ie=edge"/>' +
		'<meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="/assets/css/site.css"/></head><body><div class="top">' +
		'<header role="banner">Header</header><main>Hello world</main></div><footer>Footer</footer></body></html>';

	return RenderFile( content, 'index.yml' ).then( result => {
		RemoveDir( testDir );

		expect( result ).toBe( fixture );
	})
});
