import PropTypes from 'prop-types';
import React from 'react';


/**
 * The Project component for the display of a project
 */
const Project = ( props ) => (
	<div>
		<h3>{ props.title }</h3>
		<div>{ props.description }</div>
	</div>
);


Project.propTypes = {
	/**
	 * title: Project title
	 */
	title: PropTypes.string.isRequired,

	/**
	 * description: (text)(6)
	 */
	description: PropTypes.node.isRequired,
};


Project.defaultProps = {};


export default Project;
