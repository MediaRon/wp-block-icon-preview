/**
 * Allowed SVG tags for WordPress-safe SVG output.
 */
const ALLOWED_TAGS = new Set( [
	'svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
	'ellipse', 'defs', 'symbol', 'use', 'title', 'desc', 'clipPath',
	'linearGradient', 'radialGradient', 'stop', 'mask', 'pattern', 'filter',
	'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
	'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
	'feDropShadow', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge',
	'feMergeNode', 'feMorphology', 'feOffset', 'feSpecularLighting',
	'feTile', 'feTurbulence', 'text', 'tspan',
] );

/**
 * Disallowed SVG attributes that could cause security issues.
 */
const DISALLOWED_ATTRS = new Set( [
	'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousemove',
	'onfocus', 'onblur', 'onchange', 'onerror', 'onsubmit',
] );

/**
 * Sanitize an SVG element for WordPress-safe output.
 *
 * @param {SVGElement} svgElement - SVG element to sanitize.
 * @return {SVGElement} Sanitized SVG element.
 */
export function sanitizeSvg( svgElement ) {
	if ( ! svgElement ) {
		return null;
	}

	// Clone to avoid mutating the original.
	const clone = svgElement.cloneNode( true );

	sanitizeNode( clone );

	return clone;
}

/**
 * Recursively sanitize a node and its children.
 *
 * @param {Node} node - DOM node to sanitize.
 */
function sanitizeNode( node ) {
	if ( node.nodeType === Node.ELEMENT_NODE ) {
		const tagName = node.tagName.toLowerCase();

		if ( ! ALLOWED_TAGS.has( tagName ) ) {
			node.parentNode?.removeChild( node );
			return;
		}

		// Remove disallowed attributes.
		const attrs = Array.from( node.attributes );
		attrs.forEach( ( attr ) => {
			const attrName = attr.name.toLowerCase();
			if (
				DISALLOWED_ATTRS.has( attrName ) ||
				attrName.startsWith( 'on' ) ||
				( attrName === 'href' && attr.value.startsWith( 'javascript:' ) ) ||
				( attrName === 'xlink:href' && attr.value.startsWith( 'javascript:' ) )
			) {
				node.removeAttribute( attr.name );
			}
		} );
	}

	// Recurse into children.
	const children = Array.from( node.childNodes );
	children.forEach( ( child ) => sanitizeNode( child ) );
}
