/**
 * Full client-side pipeline: parse → metrics → sanitize → SVGR exports + React transform check.
 */

import { parseSvg } from './parse-svg';
import {
	collectOrgMetrics,
	countInlineStyles,
} from './org-svg-metrics';
import { sanitizeSvgString } from './sanitize-svg';
import { toJsx } from './to-jsx';
import { toTsx } from './to-tsx';
import {
	toBlockJsonString,
	toBlockJsonEscapedInner,
	toBlockJsonQuotedString,
} from './to-block-json-string';
import { deriveVerdict } from './process-diagnostics';
import {
	buildOrgExportSvg,
	buildToolbarExportSvg,
	buildToolbarPreviewSvgWithColors,
} from './svg-export-variants';

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

	const postParse = parseSvg( sanitizedSvg );
	const sanitizedMetrics = postParse.svg
		? collectOrgMetrics( postParse.svg )
		: preMetrics;

	let strippedInlineStyleCount = 0;
	if ( postParse.svg ) {
		const postInline = countInlineStyles( postParse.svg );
		strippedInlineStyleCount = Math.max(
			0,
			preMetrics.inlineStyleAttributeCount - postInline
		);
	}

	const orgExportSvg = buildOrgExportSvg( sanitizedSvg );
	const toolbarPreviewSvgColor = buildToolbarPreviewSvgWithColors(
		sanitizedSvg
	);
	const toolbarBuilt = buildToolbarExportSvg( sanitizedSvg );
	const toolbarPreviewSvgMono = toolbarBuilt.svgString;
	const toolbarFillsReplacedCount = toolbarBuilt.replacedCount;

	let jsxToolbarColor = '';
	let tsxToolbarColor = '';
	let jsxToolbarMono = '';
	let tsxToolbarMono = '';
	let reactTransformOk = false;
	let reactTransformError = null;

	try {
		[
			jsxToolbarColor,
			tsxToolbarColor,
			jsxToolbarMono,
			tsxToolbarMono,
		] = await Promise.all( [
			toJsx( toolbarPreviewSvgColor, componentName ),
			toTsx( toolbarPreviewSvgColor, componentName ),
			toJsx( toolbarPreviewSvgMono, componentName ),
			toTsx( toolbarPreviewSvgMono, componentName ),
		] );
		reactTransformOk = true;
	} catch ( err ) {
		reactTransformError =
			err instanceof Error ? err.message : String( err );
	}

	const verdict = deriveVerdict( {
		preMetrics,
		strippedInlineStyleCount,
		reactTransformOk,
		hasXmlDeclaration: parse.hasXmlDeclaration,
		hasDoctype: parse.hasDoctype,
	} );

	return {
		ok: true,
		componentName,
		sanitizedSvg,
		orgPreviewSvg: orgExportSvg,
		toolbarPreviewSvgColor,
		toolbarPreviewSvgMono,
		parse,
		preMetrics,
		sanitizedMetrics,
		strippedInlineStyleCount,
		verdict,
		jsxToolbarColor,
		tsxToolbarColor,
		jsxToolbarMono,
		tsxToolbarMono,
		toolbarFillsReplacedCount,
		blockJsonString: toBlockJsonString( orgExportSvg ),
		blockJsonEscapedInner: toBlockJsonEscapedInner( orgExportSvg ),
		blockJsonQuotedString: toBlockJsonQuotedString( orgExportSvg ),
		reactTransformOk,
		reactTransformError,
	};
}
