/**
 * Full client-side pipeline: parse → metrics → sanitize → SVGR exports + React transform check.
 */

import { parseSvg } from './parse-svg';
import { collectOrgMetrics } from './org-svg-metrics';
import { sanitizeSvgString } from './sanitize-svg';
import { toJsx } from './to-jsx';
import { toTsx } from './to-tsx';
import {
	toBlockJsonString,
	toBlockJsonEscapedInner,
} from './to-block-json-string';

/**
 * @param {string} rawString - User-pasted SVG.
 * @param {Object} [options]
 * @param {string} [options.componentName='BlockIcon'] - Name for TSX/JSX output.
 * @return {Promise<Object>} Result with ok flag and payloads.
 */
export async function processSvgInput( rawString, options = {} ) {
	const { componentName = 'BlockIcon' } = options;

	const parse = parseSvg( rawString );
	if ( ! parse.svg || parse.error ) {
		return {
			ok: false,
			error:
				parse.error ||
				'Could not parse SVG.',
			parse,
		};
	}

	const preMetrics = collectOrgMetrics( parse.svg );

	let sanitizedSvg;
	try {
		sanitizedSvg = sanitizeSvgString( parse.svg.outerHTML );
	} catch ( err ) {
		const message =
			err instanceof Error ? err.message : String( err );
		return {
			ok: false,
			error: message,
			parse,
			preMetrics,
		};
	}

	let jsx = '';
	let tsx = '';
	let reactTransformOk = false;
	let reactTransformError = null;

	try {
		jsx = await toJsx( sanitizedSvg, componentName );
		tsx = await toTsx( sanitizedSvg, componentName );
		reactTransformOk = true;
	} catch ( err ) {
		reactTransformError =
			err instanceof Error ? err.message : String( err );
	}

	return {
		ok: true,
		sanitizedSvg,
		parse,
		preMetrics,
		jsx,
		tsx,
		blockJsonString: toBlockJsonString( sanitizedSvg ),
		blockJsonEscapedInner: toBlockJsonEscapedInner( sanitizedSvg ),
		reactTransformOk,
		reactTransformError,
	};
}
