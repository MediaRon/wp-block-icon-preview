/**
 * Parse an SVG string and return a DOM element.
 *
 * @param {string} svgString - Raw SVG string to parse.
 * @return {SVGElement|null} Parsed SVG element or null if invalid.
 */
export function parseSvg( svgString ) {
	if ( ! svgString || typeof svgString !== 'string' ) {
		return null;
	}

	const trimmed = svgString.trim();
	if ( ! trimmed.toLowerCase().startsWith( '<svg' ) ) {
		return null;
	}

	const parser = new DOMParser();
	const doc = parser.parseFromString( trimmed, 'image/svg+xml' );
	const parserError = doc.querySelector( 'parsererror' );

	if ( parserError ) {
		return null;
	}

	return doc.documentElement;
}
