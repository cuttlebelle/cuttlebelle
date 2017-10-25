import React from "react";

export default ( page ) => (
	<table>
		<tbody>
			<tr><td>
				{ page.projects[ 0 ] }
			</td><td>
				{ page.projects[ 1 ] }
			</td></tr>
		</tbody>
	</table>
);
