/**
 * Two-column responsive layout for the icon preview tool.
 */

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.main
 * @param {import('react').ReactNode} props.sidebar
 */
export function WbipAppLayout( { main, sidebar } ) {
	return (
		<div className="wbip-layout">
			<div className="wbip-layout__main">{ main }</div>
			<aside className="wbip-layout__sidebar" aria-label="Preview and export">
				{ sidebar }
			</aside>
		</div>
	);
}
