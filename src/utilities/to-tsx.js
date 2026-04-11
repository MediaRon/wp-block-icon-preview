/**
 * SVG → TSX via SVGR (@svgr/core + @svgr/plugin-jsx).
 */

import { transform } from '@svgr/core';
import {
	createSvgrConfig,
	createSvgrState,
	normalizeSvgInput,
	sanitizeComponentName,
} from './svgr-shared-config';

/**
 * Convert sanitized SVG markup to a TypeScript React component string.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @param {string}            [name='Icon'] - Component name.
 * @return {Promise<string>} TSX source.
 */
export async function toTsx( svgInput, name = 'Icon' ) {
	const str = normalizeSvgInput( svgInput );
	if ( ! str ) {
		return '';
	}
	const componentName = sanitizeComponentName( name );
	return transform(
		str,
		createSvgrConfig( { typescript: true } ),
		createSvgrState( componentName )
	);
}
