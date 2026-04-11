/**
 * SVGO then DOMPurify for WordPress-oriented SVG strings.
 *
 * SVGO must run first so preset inlineStyles can read embedded <style> blocks and apply
 * class-based rules (e.g. .st0 { fill: #000 }) to elements before <style> is removed.
 * convertStyleToAttrs then moves presentation properties onto attributes; DOMPurify last
 * for XSS-safe output.
 *
 * Use static imports so webpack does not emit async chunks. Dynamic chunks often 404 in
 * WordPress because the runtime publicPath does not match how scripts are enqueued.
 */

import DOMPurify from 'dompurify';
import { optimize } from 'svgo/browser';

/**
 * Strip unsafe SVG/XML constructs (run after SVGO so class/stylesheet inlining can occur).
 *
 * @param {string} svgMarkup - Serialized SVG.
 * @return {string} Sanitized SVG string.
 */
export function purifySvgString( svgMarkup ) {
	if ( typeof window === 'undefined' ) {
		throw new Error( 'DOMPurify requires a browser window.' );
	}
	return DOMPurify.sanitize( svgMarkup, {
		USE_PROFILES: { svg: true },
		FORBID_TAGS: [ 'defs', 'symbol', 'use', 'script', 'style' ],
		ADD_ATTR: [
			'viewBox',
			'xmlns',
			'xml:space',
			'role',
			'aria-hidden',
			'aria-label',
			'aria-labelledby',
			'focusable',
			'preserveAspectRatio',
			'fill',
			'fill-opacity',
			'fill-rule',
			'stroke',
			'stroke-width',
			'stroke-linecap',
			'stroke-linejoin',
			'stroke-opacity',
			'stroke-dasharray',
			'stroke-dashoffset',
			'opacity',
			'transform',
			'd',
			'cx',
			'cy',
			'r',
			'rx',
			'ry',
			'x',
			'y',
			'x1',
			'y1',
			'x2',
			'y2',
			'width',
			'height',
			'points',
		],
		ALLOW_UNKNOWN_PROTOCOLS: false,
		RETURN_TRUSTED_TYPE: false,
	} );
}

/**
 * SVGO preset tuned for block-icon style output.
 *
 * @return {import('svgo').Config}
 */
export function getSvgoConfig() {
	return {
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						removeViewBox: false,
						removeTitle: true,
						removeDesc: true,
						inlineStyles: {
							onlyMatchedOnce: false,
						},
						// Keep author fills/strokes; preset defaults strip “redundant” fills and rewrite colors.
						removeUselessStrokeAndFill: false,
						convertColors: false,
					},
				},
			},
			'removeScripts',
			'removeStyleElement',
			// Hoist presentation properties out of inline style before removeAttrs drops style/class.
			'convertStyleToAttrs',
			{
				name: 'removeAttrs',
				params: {
					attrs: '(style|class)',
				},
			},
			'removeRasterImages',
		],
	};
}

/**
 * Run SVGO optimize on SVG markup.
 *
 * @param {string} svgMarkup - SVG string.
 * @return {string} Optimized SVG string.
 */
export function svgoOptimizeString( svgMarkup ) {
	const result = optimize( svgMarkup, getSvgoConfig() );
	if ( ! result || typeof result.data !== 'string' ) {
		throw new Error( 'SVGO returned no data.' );
	}
	return result.data;
}

/**
 * Full pipeline: SVGO (inlineStyles, convertStyleToAttrs, etc.) then DOMPurify.
 *
 * @param {string} svgMarkup - Serialized SVG (root `<svg>`…).
 * @return {string} Sanitized and optimized SVG string.
 */
export function sanitizeSvgString( svgMarkup ) {
	const optimized = svgoOptimizeString( svgMarkup );
	return purifySvgString( optimized );
}
