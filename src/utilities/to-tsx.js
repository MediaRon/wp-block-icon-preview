/**
 * SVG → TSX via SVGR (@svgr/core + @svgr/plugin-jsx).
 */

import { transform } from '@svgr/core';
import {
	createSvgrExportConfig,
	createSvgrState,
	normalizeSvgInput,
	patchSvgrTsxSvgPropsImport,
	sanitizeComponentName,
} from './svgr-shared-config';

/**
 * Convert SVG markup to a TypeScript React component string.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @param {string}            [name='Icon'] - Component name.
 * @param {Record<string, unknown>} [svgrOverrides] - Extra SVGR config.
 * @return {Promise<string>} TSX source.
 */
export async function toTsx( svgInput, name = 'Icon', svgrOverrides = {} ) {
	const str = normalizeSvgInput( svgInput );
	if ( ! str ) {
		return '';
	}
	const componentName = sanitizeComponentName( name );
	const code = await transform(
		str,
		createSvgrExportConfig( { typescript: true, ...svgrOverrides } ),
		createSvgrState( componentName )
	);
	return patchSvgrTsxSvgPropsImport( code );
}
