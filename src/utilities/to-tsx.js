import { toJsx } from './to-jsx';

/**
 * Convert an SVG element to TSX string format (typed React component).
 *
 * @param {SVGElement} svgElement  - SVG element to convert.
 * @param {string}     [name='Icon'] - Component name to use.
 * @return {string} TSX component string.
 */
export function toTsx( svgElement, name = 'Icon' ) {
	if ( ! svgElement ) {
		return '';
	}

	const jsxContent = toJsx( svgElement );

	return `import React from 'react';
import type { SVGProps } from 'react';

const ${ name } = ( props: SVGProps< SVGSVGElement > ) => {
\treturn (
${ indentLines( jsxContent, 2 ) }
\t);
};

export default ${ name };
`;
}

/**
 * Indent each line of a string by a given number of tabs.
 *
 * @param {string} str    - String to indent.
 * @param {number} levels - Number of tab levels to indent.
 * @return {string} Indented string.
 */
function indentLines( str, levels ) {
	const indent = '\t'.repeat( levels );
	return str
		.split( '\n' )
		.map( ( line ) => ( line.trim() ? indent + line : line ) )
		.join( '\n' );
}
