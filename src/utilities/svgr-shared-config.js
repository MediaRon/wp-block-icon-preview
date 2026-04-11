/**
 * Shared SVGR options for browser transforms (no filesystem config lookup).
 */

import jsxPlugin from '@svgr/plugin-jsx';

/**
 * Base config for downloadable components: keep root width/height from the SVG string.
 *
 * Block editor builds resolve JSX via createElement from @wordpress/element (not react).
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
		jsxRuntimeImport: {
			source: '@wordpress/element',
			specifiers: [ 'createElement' ],
		},
		// When false, @svgr/babel-preset strips width/height from the output.
		dimensions: true,
		expandProps: 'end',
		...overrides,
	};
}

/**
 * Remove the SVGR-added createElement import. @wordpress/scripts supplies JSX → createElement
 * via Babel, so the downloaded module does not need this line.
 *
 * @param {string} code - SVGR JS/TS output.
 * @return {string} Patched source.
 */
export function stripSvgrWordPressCreateElementImport( code ) {
	if ( ! code || typeof code !== 'string' ) {
		return code;
	}
	return code.replace(
		/^import \{ createElement \} from ["']@wordpress\/element["'];?\r?\n?/m,
		''
	);
}

/**
 * Post-process SVGR TypeScript: drop the createElement import, and fix SVGProps (not re-exported
 * from @wordpress/element).
 *
 * @param {string} code - SVGR TypeScript output.
 * @return {string} Patched source.
 */
export function patchSvgrTsxSvgPropsImport( code ) {
	if ( ! code || typeof code !== 'string' ) {
		return code;
	}
	let out = stripSvgrWordPressCreateElementImport( code );
	return out.replace(
		/import type \{ SVGProps \} from ["']@wordpress\/element["'];?\r?\n?/,
		"import type { SVGProps } from 'react';\n"
	);
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
