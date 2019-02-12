import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Project component for the display of a project
 */
const Project = ({ subtitle, description }) => (
	<div>
		<h3>{ subtitle }</h3>
		<div>{ description }</div>
	</div>
);


Project.propTypes = {
	/**
	 * subtitle: Project title
	 */
	subtitle: PropTypes.string.isRequired,

	/**
	 * description: (text)(6)
	 */
	description: PropTypes.node.isRequired,
};


Project.defaultProps = {};


export default Project;
