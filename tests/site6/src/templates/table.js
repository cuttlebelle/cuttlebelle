import PropTypes from 'prop-types';
import React from 'react';


const Table = ( page ) => {

	const thead = <tr colspan="2"><th scope="col"><h4>{ page.table[0][0] }</h4></th></tr>;

	const rows = page.table.map((items, index) => {
		if ( index > 0 ) {
			const values = items.map(( item, index ) => {
				return (
					<td scope="col" key={ index } className={ index+1 == items.length ? `text-right` : null } >
						{
							page._parseMD(item.replace(/(?:\r\n|\r|\n)/g, '<br />\n'))
						}
					</td>
				);
			});

			return <tr key={ index }>{ values }</tr>
		}
	})

	return (
		<div className="uikit-body uikit-grid table template-table">
			<div className="container">
				<div className="row">
					<div className="col-sm-12">
						<table className="content-table" >
							<thead>{ thead }</thead>
							<tbody>
								{ rows }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};


Table.propTypes = {
	/**
	* 	table:
	*          -
	*            - |
	*                Quality content checks
	*          -
	*            - |
	*                **Factual accuracy and relevance**
	*            - |
	*                Subject matter expert to complete
	*          -
	*            - |
	*                **Product objectives**
	*            - |
	*                Content owner to complete
	*          -
	*            - |
	*                **Legislative requirement**
	*            - |
	*                Legal to complete
	*          -
	*            - |
	*                **SEO and metadata**
	*                - meta description is engaging
	*                - URL is SEO-friendly
	*            - |
	*                Web usability expert to complete
	**/
	table: PropTypes.array,
};


Table.defaultProps = {};


export default Table;
