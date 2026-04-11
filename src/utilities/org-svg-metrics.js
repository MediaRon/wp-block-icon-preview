/**
 * Element names treated as supported for WordPress.org-style block icon SVGs.
 * Matches svg-parser-scope-org.md (structure: svg, g, path) and typical .org icon markup.
 * Any other element under `<svg>` is counted as incompatible for diagnostics.
 */
const ORG_SUPPORTED_TAG_NAMES = new Set( [ 'svg', 'g', 'path' ] );

/**
 * Walk an SVG subtree and collect metrics for diagnostics.
 *
 * @param {SVGElement} root - Root SVG element.
 * @return {Object} Metric bag used by runDiagnostics.
 */
export function collectOrgMetrics( root ) {
	let incompatibleElementCount = 0;
	/** @type {Record<string, number>} */
	const incompatibleByTag = {};
	let inlineStyleAttributeCount = 0;
	let pathCount = 0;
	let maxGroupNesting = 0;
	/** @type {Set<string>} */
	const fillValues = new Set();
	const hasViewBox = root.hasAttribute( 'viewBox' );

	/**
	 * @param {Element} el
	 * @param {number}  groupDepth
	 */
	function walk( el, groupDepth ) {
		const tag = el.tagName.toLowerCase();

		if ( ! ORG_SUPPORTED_TAG_NAMES.has( tag ) ) {
			incompatibleElementCount += 1;
			incompatibleByTag[ tag ] = ( incompatibleByTag[ tag ] || 0 ) + 1;
		}

		if ( el.hasAttribute( 'style' ) ) {
			inlineStyleAttributeCount += 1;
		}

		if ( tag === 'path' ) {
			pathCount += 1;
		}

		let nextDepth = groupDepth;
		if ( tag === 'g' ) {
			nextDepth = groupDepth + 1;
			maxGroupNesting = Math.max( maxGroupNesting, nextDepth );
		}

		const fill = el.getAttribute( 'fill' );
		if ( fill && fill.toLowerCase() !== 'none' ) {
			fillValues.add( fill.trim() );
		}

		for ( const child of el.children ) {
			walk( child, nextDepth );
		}
	}

	walk( root, 0 );

	return {
		incompatibleElementCount,
		incompatibleByTag,
		inlineStyleAttributeCount,
		pathCount,
		maxGroupNesting,
		distinctFillCount: fillValues.size,
		/** @type {string[]} Sample of distinct fill values (for diagnostics). */
		fillSamples: Array.from( fillValues ).slice( 0, 12 ),
		hasViewBox,
	};
}

/**
 * Count inline style attributes remaining after sanitization.
 *
 * @param {SVGElement} root - Root SVG element.
 * @return {number} Count of elements with a style attribute.
 */
export function countInlineStyles( root ) {
	let n = 0;
	function walk( el ) {
		if ( el.hasAttribute( 'style' ) ) {
			n += 1;
		}
		for ( const child of el.children ) {
			walk( child );
		}
	}
	walk( root );
	return n;
}
