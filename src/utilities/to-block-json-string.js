/**
 * block.json icon field helpers (inline SVG string).
 */

import { normalizeSvgInput, sanitizeComponentName } from './svgr-shared-config';
import { toTsx } from './to-tsx';

/**
 * Collapse SVG to a single-line string suitable for block.json `"icon"` value.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @return {string} Minified markup (caller must JSON-escape when embedding in JSON).
 */
export function toBlockJsonString( svgInput ) {
	const str = normalizeSvgInput( svgInput );
	if ( ! str ) {
		return '';
	}
	return str
		.replace( />\s+</g, '><' )
		.replace( /\r?\n|\r/g, '' )
		.trim();
}

/**
 * Value ready to paste inside double quotes in block.json (escapes quotes and backslashes).
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @return {string} Escaped inner string (no surrounding quotes).
 */
export function toBlockJsonEscapedInner( svgInput ) {
	const oneLine = toBlockJsonString( svgInput );
	if ( ! oneLine ) {
		return '';
	}
	return JSON.stringify( oneLine ).slice( 1, -1 );
}

/**
 * Full JSON string literal including quotes, e.g. `"<svg ...></svg>"`.
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @return {string}
 */
export function toBlockJsonQuotedString( svgInput ) {
	const oneLine = toBlockJsonString( svgInput );
	if ( ! oneLine ) {
		return '""';
	}
	return JSON.stringify( oneLine );
}

/**
 * Suggested snippet for registering a custom SVG icon in JavaScript (informative).
 *
 * @param {string|SVGElement} svgInput - SVG string or root `<svg>` element.
 * @param {string}            [componentName='BlockIcon'] - Name for the component.
 * @return {Promise<string>} Comment + TSX module text from SVGR.
 */
export async function toJsIconDefinition( svgInput, componentName = 'BlockIcon' ) {
	const tsx = await toTsx( svgInput, componentName );
	if ( ! tsx ) {
		return '';
	}
	const name = sanitizeComponentName( componentName );
	return (
		`// Save as ${ name }.tsx (or .jsx), then pass the component to registerBlockType( ..., { icon: ${ name } } ).\n` +
		tsx
	);
}
