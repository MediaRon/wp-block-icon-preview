/**
 * SVG → JSX via SVGR (@svgr/core + @svgr/plugin-jsx).
 */

import { transform } from '@svgr/core';
import {
	createSvgrConfig,
	createSvgrState,
	normalizeSvgInput,
} from './svgr-shared-config';

/**
 * Convert sanitized SVG markup to a JSX component module string.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @param {string}            [componentName='SvgIcon'] - React component name.
 * @return {Promise<string>} JSX source.
 */
export async function toJsx( svgInput, componentName = 'SvgIcon' ) {
	const str = normalizeSvgInput( svgInput );
	if ( ! str ) {
		return '';
	}
	return transform( str, createSvgrConfig(), createSvgrState( componentName ) );
}
