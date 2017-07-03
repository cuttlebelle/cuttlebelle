import PropTypes from 'prop-types';
import React from "react";


const Page = ( page ) => (
	<section>
		<h1>{ page.string }</h1>
	</section>
);


Page.propTypes = {
// ***************************** STRING
	/**
	 * string: string value
	 */
	string: PropTypes.string,
	/**
	 * stringRequired: string value
	 */
	stringRequired: PropTypes.string.isRequired,
	/**
	 * stringWithDefault: string value
	 */
	stringWithDefault: PropTypes.string,
	/**
	 * stringWithDefaultRequired: string value
	 */
	stringWithDefaultRequired: PropTypes.string.isRequired,


// ***************************** Object
	/**
	 * object:
	 *   stringvalue1: value1
	 *   stringvalue2: value2
	 */
	object: PropTypes.shape({
		stringvalue1: PropTypes.string.isRequired,
		stringvalue2: PropTypes.string,
	}),
	/**
	 * objectRequired:
	 *   stringvalue1: value1
	 *   stringvalue2: value2
	 */
	objectRequired: PropTypes.shape({
		stringvalue1: PropTypes.string.isRequired,
		stringvalue2: PropTypes.string,
	}).isRequired,
	/**
	 * objectWithDefault:
	 *   stringvalue1: value1
	 *   stringvalue2: value2
	 */
	objectWithDefault: PropTypes.shape({
		stringvalue1: PropTypes.string.isRequired,
		stringvalue2: PropTypes.string,
	}),
	/**
	 * objectWithDefaultRequired:
	 *   stringvalue1: value1
	 *   stringvalue2: value2
	 */
	objectWithDefaultRequired: PropTypes.shape({
		stringvalue1: PropTypes.string.isRequired,
		stringvalue2: PropTypes.string,
	}).isRequired,


// ***************************** ARRAY
	/**
	 * array:
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 */
	array: PropTypes.arrayOf(
		PropTypes.shape({
			stringvalue1: PropTypes.string.isRequired,
			stringvalue2: PropTypes.string,
		})
	),
	/**
	 * arrayRequired:
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 */
	arrayRequired: PropTypes.arrayOf(
		PropTypes.shape({
			stringvalue1: PropTypes.string.isRequired,
			stringvalue2: PropTypes.string,
		})
	).isRequired,
	/**
	 * arrayWithDefault:
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 */
	arrayWithDefault: PropTypes.arrayOf(
		PropTypes.shape({
			stringvalue1: PropTypes.string.isRequired,
			stringvalue2: PropTypes.string,
		})
	),
	/**
	 * arrayWithDefaultRequired:
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 *   - stringvalue1: value1
	 *     stringvalue2: value2
	 */
	arrayWithDefaultRequired: PropTypes.arrayOf(
		PropTypes.shape({
			stringvalue1: PropTypes.string.isRequired,
			stringvalue2: PropTypes.string,
		})
	).isRequired,


// ***************************** ENUM
	/**
	 * enum: two
	 */
	enum: PropTypes.oneOf([ 'one', 'two', 'three' ]),
	/**
	 * enumRequired: two
	 */
	enumRequired: PropTypes.oneOf([ 'one', 'two', 'three' ]).isRequired,
	/**
	 * enumWithDefault: two
	 */
	enumWithDefault: PropTypes.oneOf([ 'one', 'two', 'three' ]),
	/**
	 * enumWithDefaultRequired: two
	 */
	enumWithDefaultRequired: PropTypes.oneOf([ 'one', 'two', 'three' ]).isRequired,


// ***************************** TEXT
	/**
	 * text: [text](7)
	 */
	text: PropTypes.string,
	/**
	 * textRequired: [text](7)
	 */
	textRequired: PropTypes.string.isRequired,
	/**
	 * textWithDefault: [text](7)
	 */
	textWithDefault: PropTypes.string,
	/**
	 * textWithDefaultRequired: [text](7)
	 */
	textWithDefaultRequired: PropTypes.string.isRequired,


// ***************************** NODE
	/**
	 * node: [partials](3)
	 */
	node: PropTypes.node,
	/**
	 * nodeRequired: [partials](3)
	 */
	nodeRequired: PropTypes.node.isRequired,
	/**
	 * nodeWithDefault: [partials](3)
	 */
	nodeWithDefault: PropTypes.node,
	/**
	 * nodeWithDefaultRequired: [partials](3)
	 */
	nodeWithDefaultRequired: PropTypes.node.isRequired,
};


Page.defaultProps = {
	stringWithDefault: 'stringWithDefault',
	stringWithDefaultRequired: 'stringWithDefaultRequired',

	objectWithDefault: { stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' },
	objectWithDefaultRequired: { stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' },

	arrayWithDefault: [{ stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' }, { stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' }],
	arrayWithDefaultRequired: [{ stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' }, { stringvalue1: 'stringvalue', stringvalue2: 'stringvalue' }],

	enumWithDefault: 'two',
	enumWithDefaultRequired: 'two',

	textWithDefault: 'textWithDefault',
	textWithDefaultRequired: 'textWithDefaultRequired',

	nodeWithDefault: 'nodeWithDefault',
	nodeWithDefaultRequired: 'nodeWithDefaultRequired',
};


export default Page;
