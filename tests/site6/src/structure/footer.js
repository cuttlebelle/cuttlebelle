import PropTypes from 'prop-types';
import React from 'react';

/**
 * Footer layout
 */
const Footer = ( page ) => {

	const theme = page._pages[ page._ID ].theme ? page._pages[ page._ID ].theme : 'dark';

	return (
		<footer className={`uikit-grid uikit-body uikit-footer footer footer--${ theme }`} role="contentinfo">
			<div className="container">
				<div className="row">
					<div className="col-md-2">
						<img className="footer__logo" src={`/assets/img/coa${ theme === 'blue' || theme === 'dark' ? '-white' : '' }.png`}
							alt="The Australian Government coat of Arms" />
					</div>
					<div className="col-md-10">
						<div className="footer__links__wrapper">
							<ul className={`footer__links uikit-link-list uikit-link-list--inline uikit-link-list--inverted`}>
								{
									page.links && page.links.map( ( link, i ) => {
										return (
											<li key={ i } className="footer__listitem" >
												{
													page._pages[ link.title ]
														? <a href={ page._pages[ link.title ].url } className="footer__link">{ page._pages[ link.title ].pagetitle }</a>
														: <a href={ link.url } className="footer__link">{ link.title }</a>
												}
											</li>
										)
									})
								}
							</ul>
						</div>
						<div className="footer__text footer__text--small">
							{ page._body }
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}


Footer.propTypes = {
	/**
	*     -  title: homepage
	*     -  title: privacy-statement
	*     -  title: Disclaimer
	*        url: https://www.dta.gov.au/disclaimer/
	*     -  title: sitemap
	**/
	links: PropTypes.array.isRequired,

	/**
	 * _body: (text)(2)
	 */
	_body: PropTypes.node.isRequired,
};


Footer.defaultProps = {};


export default Footer;
