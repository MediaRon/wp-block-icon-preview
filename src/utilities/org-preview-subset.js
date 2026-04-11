/**
 * Build an SVG string for .org-style preview: only svg, g, and path elements.
 * Other elements (e.g. circle, rect) are removed; empty groups may remain.
 */

const ORG_PREVIEW_TAGS = new Set( [ 'svg', 'g', 'path' ] );

/**
 * @param {SVGElement} root - Root SVG element (will be cloned, not mutated).
 * @return {string} Serialized SVG markup.
 */
export function serializeOrgIconSubset( root ) {
	const clone = /** @type {SVGElement} */ ( root.cloneNode( true ) );
	pruneDisallowedElements( clone );
	removeEmptyGroups( clone );
	return clone.outerHTML;
}

/**
 * @param {SVGElement} el - Element whose subtree is pruned in place.
 */
function pruneDisallowedElements( el ) {
	const children = Array.from( el.children );
	for ( const child of children ) {
		const tag = child.tagName.toLowerCase();
		if ( ! ORG_PREVIEW_TAGS.has( tag ) ) {
			child.remove();
			continue;
		}
		pruneDisallowedElements( /** @type {SVGElement} */ ( child ) );
	}
}

/**
 * Remove empty `<g>` wrappers after pruning (bottom-up).
 *
 * @param {SVGElement} el - Root to walk.
 */
function removeEmptyGroups( el ) {
	const children = Array.from( el.children );
	for ( const child of children ) {
		if ( child.tagName.toLowerCase() === 'g' ) {
			removeEmptyGroups( /** @type {SVGElement} */ ( child ) );
			if ( child.children.length === 0 ) {
				child.remove();
			}
		}
	}
}

/**
 * @param {string} svgMarkup - Sanitized full SVG string.
 * @return {string} SVG with only svg / g / path nodes, or empty string if invalid.
 */
export function toOrgPreviewSvgString( svgMarkup ) {
	if ( ! svgMarkup || typeof svgMarkup !== 'string' ) {
		return '';
	}
	const parser = new DOMParser();
	const doc = parser.parseFromString( svgMarkup.trim(), 'text/xml' );
	const err = doc.querySelector( 'parsererror' );
	if ( err ) {
		return '';
	}
	const svg = doc.querySelector( 'svg' );
	if ( ! svg ) {
		return '';
	}
	return serializeOrgIconSubset( svg );
}
