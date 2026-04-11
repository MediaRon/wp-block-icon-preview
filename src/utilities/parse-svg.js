/**
 * Parse raw SVG markup and return the root element or an error.
 *
 * @param {string} svgString - Raw SVG string to parse.
 * @return {{ svg: SVGElement|null, error: string|null, hasXmlDeclaration: boolean, hasDoctype: boolean }} Parse result.
 */
export function parseSvg( svgString ) {
	if ( typeof svgString !== 'string' ) {
		return {
			svg: null,
			error: 'Input must be a string.',
			hasXmlDeclaration: false,
			hasDoctype: false,
		};
	}

	const trimmed = svgString.trim();
	if ( ! trimmed ) {
		return {
			svg: null,
			error: 'Empty SVG input.',
			hasXmlDeclaration: false,
			hasDoctype: false,
		};
	}

	const hasXmlDeclaration = /<\?xml/i.test( svgString );
	const hasDoctype = /<!DOCTYPE/i.test( svgString );
	const parser = new DOMParser();
	const doc = parser.parseFromString( trimmed, 'text/xml' );
	const parserError = doc.querySelector( 'parsererror' );

	if ( parserError ) {
		const text = parserError.textContent || '';
		return {
			svg: null,
			error: text.trim() || 'Invalid XML.',
			hasXmlDeclaration,
			hasDoctype,
		};
	}

	const svg = doc.querySelector( 'svg' );
	if ( ! svg ) {
		return {
			svg: null,
			error: 'No root <svg> element found.',
			hasXmlDeclaration,
			hasDoctype,
		};
	}

	return {
		svg,
		error: null,
		hasXmlDeclaration,
		hasDoctype,
	};
}
