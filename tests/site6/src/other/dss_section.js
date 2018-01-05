import PropTypes from 'prop-types';
import Slugify from 'slugify';
import React from 'react';

const CRITERIA = {
	'1': {
		title: `Understand user needs`,
		link: `/digital-service-standard/1-understand-user-needs/`,
	},
	'2': {
		title: `Have a multidisciplinary team`,
		link: `/digital-service-standard/2-multidisciplinary-team/`,
	},
	'3': {
		title: `Agile and user-centred process`,
		link: `/digital-service-standard/3-agile-and-user-centred/`,
	},
	'4': {
		title: `Understand tools and systems`,
		link: `/digital-service-standard/4-tools-and-systems/`,
	},
	'5': {
		title: `Make it secure`,
		link: `/digital-service-standard/5-make-it-secure/`,
	},
	'6': {
		title: `Consistent and responsive design`,
		link: `/digital-service-standard/6-consistent-and-responsive/`,
	},
	'7': {
		title: `Use open standards and common platforms`,
		link: `/digital-service-standard/7-open-standards-and-common-platforms/`,
	},
	'8': {
		title: `Make source code open`,
		link: `/digital-service-standard/8-make-source-code-open/`,
	},
	'9': {
		title: `Make it accessible`,
		link: `/digital-service-standard/9-make-it-accessible/`,
	},
	'10': {
		title: `Test the service`,
		link: `/digital-service-standard/10-test-the-service/`,
	},
	'11': {
		title: `Measure performance`,
		link: `/digital-service-standard/11-measure-performance/`,
	},
	'12': {
		title: `Don’t forget the non-digital experience`,
		link: `/digital-service-standard/12-non-digital-experience/`,
	},
	'13': {
		title: `Encourage everyone to use the digital service`,
		link: `/digital-service-standard/13-encourage-use-of-the-digital-service/`,
	},
};


/**
 * The section component
 */
const DSSSection = ( page ) => {

	return (
	<div className={` uikit-body uikit-grid dss-section ${ page.level ? 'dss-section--level' + page.level : '' } `}>
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-sm-6" id={ Slugify( page.section ).toLowerCase() }>

					<span className="section__section dss-section__section">{ page.section }</span>
					<div className="dss-section__text">{ page._body }</div>
				</div>
				<div className="col-md-4 col-sm-6">
					<div className="dss-section__criteria">
						<strong className="dss-section__criteria__headline">Digital Service Standard</strong>
						<ul className="dss-section__criteria__list">
							{
								page.dss.map( ( criteria, i ) => (
									<li key={ i } className="dss-section__criteria__list__item">
										<span className="dss-section__criteria__list__item__digit">{ criteria }</span>
										<a className="dss-section__criteria__list__item__link" href={ CRITERIA[ criteria ].link }>{ CRITERIA[ criteria ].title }</a>
									</li>
								))
							}
						</ul>
						<a className="dss-section__criteria__cta uikit-cta-link" href="/digital-service-standard/">Read the criteria</a>
					</div>
				</div>
			</div>
		</div>
	</div>
);
}


DSSSection.propTypes = {
	/**
	 * dss:
	 *   - 1
	 *   - 3
	 *   - 8
	 *   - 13
	 */
	dss: PropTypes.arrayOf(
		PropTypes.oneOf([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ])
	).isRequired,

	/**
	 * section: Guides
	 */
	section: PropTypes.string.isRequired,

	/**
	 * level: 2
	 */
	level: PropTypes.number,

	/**
	 * _body: (text)(7)
	 */
	_body: PropTypes.node.isRequired,
};


DSSSection.defaultProps = {};


export default DSSSection;
