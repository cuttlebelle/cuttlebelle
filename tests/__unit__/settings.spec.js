/***************************************************************************************************************************************************************
 *
 * settings.js unit tests
 *
 * @file - src/settings.js
 *
 * Testing methods:
 * SETTINGS
 **************************************************************************************************************************************************************/


import { SETTINGS } from '../../src/settings';
import Path from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SETTINGS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('SETTINGS.get() - The default settings are correct', () => {
	const defaults = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'files/',
			index: '.template/docs/layout/index.js',
			category: '.template/docs/layout/category.js',
		},
	};

	expect( SETTINGS.get() ).toMatchObject( defaults );
});


test('SETTINGS.set() - Not setting anything will merge default correctly', () => {
	const changes = undefined;
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'files/',
			index: '.template/docs/layout/index.js',
			category: '.template/docs/layout/category.js',
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Not setting folder will merge default correctly', () => {
	const changes = {};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'files/',
			index: '.template/docs/layout/index.js',
			category: '.template/docs/layout/category.js',
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Prevent cwd from being set', () => {
	const changes = {
		folder: {
			cwd: 'test',
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'files/',
			index: '.template/docs/layout/index.js',
			category: '.template/docs/layout/category.js',
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Set settings correctly', () => {
	const changes = {
		folder: {
			content: 'test',
		},
		layouts: {
			page: 'test',
		},
		site: {
			root: 'test',
		},
		docs: {
			root: 'test',
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/test/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			docs: Path.normalize(`${ process.cwd() }/docs/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'test',
			partial: 'partial',
		},
		site: {
			root: 'test',
			doctype: '<!DOCTYPE html>',
			redirectReact: true,
			markdownRenderer: '',
		},
		docs: {
			root: 'test',
			index: '.template/docs/layout/index.js',
			category: '.template/docs/layout/category.js',
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});


test('SETTINGS.set() - Set all settings correctly', () => {
	const changes = {
		folder: {
			cwd: 'test',
			content: 'test',
			src: 'test',
			assets: 'test/test/',
			site: 'test/',
			docs: 'test/',
			index: 'test',
			homepage: 'test',
		},
		layouts: {
			page: 'test',
			partial: 'test',
		},
		site: {
			root: 'test',
			doctype: 'test',
			redirectReact: 'test',
			markdownRenderer: 'test',
		},
		docs: {
			root: 'test',
			index: 'test',
			category: 'test',
		},
	};
	const settings = {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/test/`),
			src: Path.normalize(`${ process.cwd() }/test/`),
			assets: Path.normalize(`${ process.cwd() }/test/test/`),
			site: Path.normalize(`${ process.cwd() }/test/`),
			docs: Path.normalize(`${ process.cwd() }/test/`),
			index: 'test',
			homepage: 'test',
		},
		layouts: {
			page: 'test',
			partial: 'test',
		},
		site: {
			root: 'test',
			doctype: 'test',
			redirectReact: 'test',
			markdownRenderer: 'test',
		},
		docs: {
			root: 'test',
			index: 'test',
			category: 'test',
		},
	};

	expect( SETTINGS.set( changes ) ).toMatchObject( settings );
});
