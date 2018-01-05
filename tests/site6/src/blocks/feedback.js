import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Feedback component to be used after all content blocks
 */
const Feedback = ( page ) => {

	const HeadingTag = `h${ page.level }`;

	return (
		<div className="uikit-body uikit-grid feedback">
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						<HeadingTag className="feedback__title display-3">{ page.title }</HeadingTag>
						<div className="textwrapper">
							<p className="feedback__caption1">{ page.caption1 }</p>
							<p className="feedback__button">
								<a href="https://www.surveymonkey.com/r/XFWJ5TC" className="uikit-btn">
									Give feedback
								</a>
							</p>
							<span>{ page._body }</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


Feedback.propTypes = {

	/**
	 * caption: This is the first release of Gov.au Service Manual. We'd love to know what's missing or could be done better
	 */
	caption: PropTypes.string,

	/**
	 * buttonUrl: /feedback
	 */
	buttonUrl: PropTypes.string.isRequired,

	/**
	 * buttonText: Send us feedback
	 */
	buttonText: PropTypes.string.isRequired,
};


Feedback.defaultProps = {};


export default Feedback;
