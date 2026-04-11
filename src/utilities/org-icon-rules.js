/**
 * WordPress.org plugin-directory rules for block icon SVG root elements.
 * Only these attributes are kept on `<svg>` in .org preview and block.json output.
 */

/** @type {ReadonlySet<string>} Lowercase comparison names (viewBox → viewbox). */
export const ORG_ALLOWED_SVG_ROOT_ATTR_NAMES_LC = new Set( [
	'role',
	'aria-hidden',
	'xmlns',
	'width',
	'height',
	'viewbox',
	'fill',
] );

/**
 * @param {Element} svgEl - Root SVG element.
 * @return {string[]} Disallowed attribute names as in the DOM (original casing), for diagnostics.
 */
export function listDisallowedOrgRootSvgAttributeNames( svgEl ) {
	if ( ! svgEl || svgEl.tagName.toLowerCase() !== 'svg' ) {
		return [];
	}
	/** @type {string[]} */
	const out = [];
	for ( let i = 0; i < svgEl.attributes.length; i++ ) {
		const attr = svgEl.attributes[ i ];
		const lc = attr.name.toLowerCase();
		if ( ! ORG_ALLOWED_SVG_ROOT_ATTR_NAMES_LC.has( lc ) ) {
			out.push( attr.name );
		}
	}
	return out;
}

/**
 * Remove root `<svg>` attributes not allowed on WordPress.org block icons.
 *
 * @param {Element} svgEl - Root SVG (mutated in place).
 */
export function stripNonOrgSvgRootAttributes( svgEl ) {
	const names = listDisallowedOrgRootSvgAttributeNames( svgEl );
	for ( const name of names ) {
		svgEl.removeAttribute( name );
	}
}
