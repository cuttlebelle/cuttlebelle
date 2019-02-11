import PropTypes from 'prop-types';
import React from 'react';


/**
 * The intro component
 */
const Intro = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<div className={`uikit-body uikit-grid intro intro--${ theme }`}>
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<div className="textwrapper">

							{ page.category && <span id={ (page.category).toLowerCase() } className="section__section intro__category">{ page.category }</span> }
							<h1 className="intro__headline">{ page.title ? page.title : page._pages[ page._ID ].pagetitle }</h1>
							{ page.subtitle && <p className="intro__subtitle">{ page.subtitle }</p> }
							{ page.attrTitle1 &&
								<div className="intro__metadata intro__metadata--intro small">
									<dl>
									<dt>{ page.attrTitle1 }</dt>
									<dd>{ page.attrLink1 ? (
										<a href={ page.attrLink1 }>{ page.attrValue1 }</a>
										) : (
										<span>{ page.attrValue1 }</span>
										)}
									</dd>
									<dt>{ page.attrTitle2 }</dt>
									<dd>{ page.attrLink2 ? (
										<a href={ page.attrLink2 }>{ page.attrValue2 }</a>
										) : (
										<span>{ page.attrValue2 }</span>
										)}
									</dd>
									</dl>
								</div>
							}
							<div className="intro__text">{ page._body }</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


Intro.propTypes = {
	/**
	 * category: Content strategy
	 */
	category: PropTypes.string,

	/**
	 * attrTitle1: Created by
	 */
	attrTitle1: PropTypes.string,

	/**
	 * attrValue1: Digital Transformation Agency, Department of Immigration and Border Protection
	 */
	attrValue1: PropTypes.string,

	/**
	 * attrLink1: http://google.com
	 */
	attrLink1: PropTypes.string,

	/**
	 * attrTitle2: 4 June 2017
	 */
	attrTitle2: PropTypes.string,

	/**
	 * attrValue2: 4 June 2017
	 */
	attrValue2: PropTypes.string,

	/**
	 * attrLink2: http://google.com
	 */
	attrLink2: PropTypes.string,

	/**
	 * title: Page title  # if not given, it takes the title from the current page
	 */
	title: PropTypes.string,

	/**
	 * subtitle: Welcome to our intro
	 */
	subtitle: PropTypes.string,

	/**
	 * _body: (text)(4)
	 */
	_body: PropTypes.node.isRequired,
};


Intro.defaultProps = {};


export default Intro;
