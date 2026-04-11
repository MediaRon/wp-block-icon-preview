/**
 * Prepare SVG strings for .org (16px, keep fills) vs toolbar/components (24px, currentColor).
 */

import { toOrgPreviewSvgString } from './org-preview-subset';

/**
 * Set root `<svg>` width/height to a pixel size.
 *
 * @param {string} svgString - Full SVG markup.
 * @param {number} px        - Pixel size (e.g. 16 or 24).
 * @return {string} Serialized SVG.
 */
export function setRootDimensionsPx( svgString, px ) {
	if ( ! svgString || typeof svgString !== 'string' ) {
		return '';
	}
	const doc = new DOMParser().parseFromString(
		svgString.trim(),
		'text/xml'
	);
	if ( doc.querySelector( 'parsererror' ) ) {
		return svgString;
	}
	const svg = doc.querySelector( 'svg' );
	if ( ! svg ) {
		return svgString;
	}
	svg.setAttribute( 'width', `${ px }px` );
	svg.setAttribute( 'height', `${ px }px` );
	return new XMLSerializer().serializeToString( svg );
}

/**
 * Replace solid fills with currentColor for toolbar-style icons.
 *
 * @param {string} svgString - SVG markup.
 * @return {{ svgString: string, replacedCount: number }} Updated markup and count of fills changed.
 */
export function replaceFillsWithCurrentColor( svgString ) {
	if ( ! svgString || typeof svgString !== 'string' ) {
		return { svgString: '', replacedCount: 0 };
	}
	const doc = new DOMParser().parseFromString(
		svgString.trim(),
		'text/xml'
	);
	if ( doc.querySelector( 'parsererror' ) ) {
		return { svgString, replacedCount: 0 };
	}
	const svg = doc.querySelector( 'svg' );
	if ( ! svg ) {
		return { svgString, replacedCount: 0 };
	}
	let replacedCount = 0;

	/**
	 * @param {Element} el
	 */
	function walk( el ) {
		if ( el.hasAttribute( 'fill' ) ) {
			const v = el.getAttribute( 'fill' );
			if ( v ) {
				const lower = v.trim().toLowerCase();
				if (
					lower !== 'none' &&
					lower !== 'currentcolor' &&
					lower !== 'inherit'
				) {
					el.setAttribute( 'fill', 'currentColor' );
					replacedCount += 1;
				}
			}
		}
		for ( const child of el.children ) {
			walk( child );
		}
	}

	walk( svg );
	return {
		svgString: new XMLSerializer().serializeToString( svg ),
		replacedCount,
	};
}

/**
 * .org export/display: svg/g/path only, root `<svg>` limited to role, aria-hidden, xmlns,
 * width, height, viewBox, fill; 16px root; original fills on remaining nodes.
 *
 * @param {string} sanitizedFullSvg - Post-sanitize SVG.
 * @return {string} Markup for .org preview and SVGR org exports.
 */
export function buildOrgExportSvg( sanitizedFullSvg ) {
	const subset = toOrgPreviewSvgString( sanitizedFullSvg );
	return setRootDimensionsPx( subset, 16 );
}

/**
 * Toolbar preview at 24px with original fills (no currentColor substitution).
 *
 * @param {string} sanitizedFullSvg - Post-sanitize SVG.
 * @return {string} Markup for toolbar preview “color” mode.
 */
export function buildToolbarPreviewSvgWithColors( sanitizedFullSvg ) {
	return setRootDimensionsPx( sanitizedFullSvg, 24 );
}

/**
 * Toolbar / block editor export: full sanitized SVG, 24px root, fills → currentColor.
 *
 * @param {string} sanitizedFullSvg - Post-sanitize SVG.
 * @return {{ svgString: string, replacedCount: number }}
 */
export function buildToolbarExportSvg( sanitizedFullSvg ) {
	const sized = setRootDimensionsPx( sanitizedFullSvg, 24 );
	return replaceFillsWithCurrentColor( sized );
}
