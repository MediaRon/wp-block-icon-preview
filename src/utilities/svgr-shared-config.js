/**
 * Shared SVGR options for browser transforms (no filesystem config lookup).
 */

import jsxPlugin from '@svgr/plugin-jsx';
import { sanitizeComponentName } from './svg-input-utils';

export { normalizeSvgInput, sanitizeComponentName } from './svg-input-utils';

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
