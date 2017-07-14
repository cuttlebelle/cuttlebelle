/***************************************************************************************************************************************************************
 *
 * Keeping track of progress and displaying a progress bar
 *
 * Progress          - Store and display progress
 * Progress.set      - Set how many page we have to go through
 * Progress.tick     - Tick off one page
 * Progress.display  - Display current progress
 * Progress.finished - Clear progress display
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Size from 'window-size';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings.js';
import { Log, Style } from './helper';


/**
 * Store and display progress
 *
 * @type {Object}
 */
export const Progress = {
	todo: 0,
	done: 0,

	/**
	 * Set how many page we have to go through
	 *
	 * @param  {integer} amount - The amount of pages we have to get through
	 */
	set: ( amount ) => {
		Progress.todo = amount;
	},


	/**
	 * Tick off one page
	 */
	tick: () => {
		Progress.done ++;

		Progress.display();
	},


	/**
	 * Display current progress
	 */
	display: () => {
		if( Progress.todo > 30 && !Log.verboseMode ) { // only if we have at least x pages to render and verbose is off
			const progress = ( 100 / Progress.todo ) * Progress.done;
			const padding = 13;

			if( Size.width > padding ) {
				const maxWidth = Size.width - ( padding * 2 ) - 2;
				const currentWidth = Math.ceil( maxWidth * ( progress / 100 ) );
				const whitespace = maxWidth - currentWidth < 0 ? 0 : maxWidth - currentWidth;

				Progress.clear();
				process.stdout.write(`${ ' '.repeat( padding ) }┤${ Style.gray('▓').repeat( currentWidth ) }${ ' '.repeat( whitespace ) }├`);

				if( progress === 100 ) {
					Progress.clear();
				}
			}
		}
	},


	/**
	 * Clear progress display
	 */
	clear: () => {
		process.stdout.write('\r\x1b[K'); // reset cursor
	},
};
