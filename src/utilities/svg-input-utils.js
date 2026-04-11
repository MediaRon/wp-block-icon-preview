/**
 * Pure SVG string / component-name helpers with no SVGR or other heavy dependencies.
 * Import this from UI code (e.g. Sidebar) so the view bundle does not pull @svgr/*.
 */

/**
 * @param {string} name - Raw name from caller.
 * @return {string} Valid PascalCase identifier.
 */
export function sanitizeComponentName( name ) {
	const base = String( name || 'Icon' ).replace( /[^a-zA-Z0-9_]/g, '' );
	if ( ! base || /^[0-9]/.test( base ) ) {
		return 'Icon';
	}
	return base.charAt( 0 ).toUpperCase() + base.slice( 1 );
}

/**
 * @param {string|SVGElement} input - SVG string or root element.
 * @return {string} Trimmed SVG markup.
 */
export function normalizeSvgInput( input ) {
	if ( typeof input === 'string' ) {
		return input.trim();
	}
	if (
		input &&
		typeof input === 'object' &&
		typeof input.outerHTML === 'string'
	) {
		return input.outerHTML.trim();
	}
	return '';
}
