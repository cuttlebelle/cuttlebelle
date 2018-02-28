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
 * @flow
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Size from 'window-size';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { SETTINGS } from './settings';


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
	set: ( amount /*: number */ ) /*: void */ => {
		Progress.todo = amount;
	},


	/**
	 * Tick off one page
	 */
	tick: ( width /*: number */) /*: void */ => {
		Progress.done ++;

		Progress.display( width );
	},


	/**
	 * Display current progress
	 */
	display: ( width /*: ?number */ ) /*: void */ => {
		if( !width || width === undefined ) {
			width = Size ? Size.width : 0;
		}

		if( Progress.todo > 30 && !Log.verboseMode ) { // only if we have at least x pages to render and verbose is off
			const progress = ( 100 / Progress.todo ) * Progress.done;
			const padding = 13;

			if( width > padding ) {
				const ENDBITS = 2; // those -> ┤ and ├
				const maxWidth = width - ( padding * 2 ) - ENDBITS;
				const currentWidth = Math.ceil( maxWidth * ( progress / 100 ) );
				const whitespace = maxWidth - currentWidth > -1
					? maxWidth - currentWidth
					: 0;

				Progress.clear();
				process.stdout.write(`${ ' '.repeat( padding ) }┤${ Style.gray('▓').repeat( currentWidth ) }${ ' '.repeat( whitespace ) }├`);

				if( progress >= 100 ) {
					Progress.clear();
				}
			}
		}
	},


	/**
	 * Clear progress display
	 */
	clear: () /*: void */ => {
		process.stdout.write('\r\x1b[K'); // reset cursor
	},
};
