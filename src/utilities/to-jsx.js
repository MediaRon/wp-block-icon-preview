/**
 * SVG → JSX via SVGR (@svgr/core + @svgr/plugin-jsx).
 */

import { transform } from '@svgr/core';
import {
	createSvgrExportConfig,
	createSvgrState,
	normalizeSvgInput,
	stripSvgrWordPressCreateElementImport,
} from './svgr-shared-config';

/**
 * Convert SVG markup to a JSX component module string.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @param {string}            [componentName='SvgIcon'] - React component name.
 * @param {Record<string, unknown>} [svgrOverrides] - Extra SVGR config.
 * @return {Promise<string>} JSX source.
 */
export async function toJsx(
	svgInput,
	componentName = 'SvgIcon',
	svgrOverrides = {}
) {
	const str = normalizeSvgInput( svgInput );
	if ( ! str ) {
		return '';
	}
	const code = await transform(
		str,
		createSvgrExportConfig( svgrOverrides ),
		createSvgrState( componentName )
	);
	return stripSvgrWordPressCreateElementImport( code );
}
