/**
 * Shared SVGR options for browser transforms (no filesystem config lookup).
 */

import jsxPlugin from '@svgr/plugin-jsx';

/**
 * Base config for downloadable components: explicit SVG width/height (no 1em from icon mode).
 *
 * @param {Record<string, unknown>} [overrides] - Merged onto base config.
 * @return {import('@svgr/core').Config}
 */
export function createSvgrExportConfig( overrides = {} ) {
	return {
		plugins: [ jsxPlugin ],
		icon: false,
		svgo: false,
		prettier: false,
		runtimeConfig: false,
		jsxRuntime: 'classic',
		dimensions: false,
		expandProps: 'end',
		...overrides,
	};
}

/**
 * @param {string} [name='SvgIcon'] - Desired component name.
 * @return {{ componentName: string }}
 */
export function createSvgrState( name = 'SvgIcon' ) {
	return { componentName: sanitizeComponentName( name ) };
}

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
