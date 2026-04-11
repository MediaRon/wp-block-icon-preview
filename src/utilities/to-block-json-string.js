/**
 * Convert an SVG element to a block.json-compatible icon string.
 *
 * WordPress block.json accepts either:
 *   - A Dashicon slug string, e.g., "admin-appearance"
 *   - An inline SVG string for the block icon
 *
 * This utility outputs the SVG as a serialized string suitable
 * for copy-pasting into a block.json `icon` field or a JS icon definition.
 *
 * @param {SVGElement} svgElement - SVG element to convert.
 * @return {string} Serialized SVG string suitable for block.json.
 */
export function toBlockJsonString( svgElement ) {
	if ( ! svgElement ) {
		return '';
	}

	const serializer = new XMLSerializer();
	const serialized = serializer.serializeToString( svgElement );

	// Clean up namespace declarations added by XMLSerializer.
	const cleaned = serialized
		.replace( / xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '' )
		.replace( / xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, '' );

	return cleaned;
}

/**
 * Format the SVG as a JS icon definition for WordPress block registration.
 *
 * @param {SVGElement} svgElement - SVG element to convert.
 * @return {string} JavaScript icon definition string.
 */
export function toJsIconDefinition( svgElement ) {
	if ( ! svgElement ) {
		return '';
	}

	const svgString = toBlockJsonString( svgElement );

	return `const icon = (
\t${ svgString }
);

export default icon;`;
}
