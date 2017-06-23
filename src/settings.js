/***************************************************************************************************************************************************************
 *
 * Get settings and merge with defaults
 *
 * SETTINGS     - Keeping our settings across multiple imports
 * SETTINGS.get - Getting our settings
 * SETTINGS.set - Merge with default settings
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Helper
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';


/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
export const SETTINGS = {
	/**
	 * The default settings
	 *
	 * @type {Object}
	 */
	defaults: {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			src: Path.normalize(`${ process.cwd() }/src/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/site/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'page',
			partial: 'partial',
		},
		site: {
			root: '/',
			doctype: '<!DOCTYPE html>', // https://github.com/facebook/react/issues/1035
			redirectReact: true,
			markdownRenderer: '',
		},
	},


	/**
	 * Getting our settings
	 *
	 * @return {object} - The settings object
	 */
	get: () => {
		return SETTINGS.defaults;
	},


	/**
	 * Merge with default settings
	 *
	 * @param  {object} localSettings - The new settings object to be merged
	 *
	 * @return {object}               - Our new settings
	 */
	set: ( localSettings ) => {
		Log.verbose(`Merging default setting with`);
		Log.verbose( Style.yellow( JSON.stringify( localSettings ) ) );

		if( localSettings ) {
			if( !localSettings.folder ) {
				localSettings.folder = {};
			}
			if( !localSettings.layouts ) {
				localSettings.layouts = {};
			}
			if( !localSettings.site ) {
				localSettings.site = {};
			}

			delete localSettings.folder.cwd; // ignore the cwd key

			// let’s make them absolute
			if( localSettings.folder.content && !Path.isAbsolute( localSettings.folder.content ) ) {
				localSettings.folder.content = Path.normalize(`${ process.cwd() }/${ localSettings.folder.content }`);
			}
			if( localSettings.folder.src && !Path.isAbsolute( localSettings.folder.src ) ) {
				localSettings.folder.src = Path.normalize(`${ process.cwd() }/${ localSettings.folder.src }`);
			}
			if( localSettings.folder.site && !Path.isAbsolute( localSettings.folder.site ) ) {
				localSettings.folder.site = Path.normalize(`${ process.cwd() }/${ localSettings.folder.site }`);
			}

			const newSettings = {};

			newSettings.folder = Object.assign( SETTINGS.defaults.folder, localSettings.folder );
			newSettings.layouts = Object.assign( SETTINGS.defaults.layouts, localSettings.layouts );
			newSettings.site = Object.assign( SETTINGS.defaults.site, localSettings.site );

			SETTINGS.defaults = newSettings;

			Log.verbose(`New settings now:`);
			Log.verbose( Style.yellow( JSON.stringify( newSettings ) ) );

			return newSettings;
		}
	},
};
