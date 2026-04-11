/**
 * Convert an SVG element to JSX string format.
 *
 * @param {SVGElement} svgElement - SVG element to convert.
 * @return {string} JSX string representation.
 */
export function toJsx( svgElement ) {
	if ( ! svgElement ) {
		return '';
	}

	return nodeToJsx( svgElement );
}

/**
 * Recursively convert a DOM node to JSX string.
 *
 * @param {Node}   node   - DOM node to convert.
 * @param {number} indent - Current indentation level.
 * @return {string} JSX string.
 */
function nodeToJsx( node, indent = 0 ) {
	if ( node.nodeType === Node.TEXT_NODE ) {
		const text = node.textContent.trim();
		return text ? ' '.repeat( indent * 2 ) + text : '';
	}

	if ( node.nodeType !== Node.ELEMENT_NODE ) {
		return '';
	}

	const tag = node.tagName.toLowerCase();
	const attrs = attrsToJsx( node.attributes );
	const children = Array.from( node.childNodes )
		.map( ( child ) => nodeToJsx( child, indent + 1 ) )
		.filter( Boolean );

	const indentStr = ' '.repeat( indent * 2 );

	if ( children.length === 0 ) {
		return `${ indentStr }<${ tag }${ attrs } />`;
	}

	const childStr = children.join( '\n' );
	return `${ indentStr }<${ tag }${ attrs }>\n${ childStr }\n${ indentStr }</${ tag }>`;
}

/**
 * SVG attributes that are semantically numeric and safe to render as JSX expressions.
 */
const NUMERIC_ATTRS = new Set( [
	'width', 'height', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'r', 'rx', 'ry',
	'cx', 'cy', 'dx', 'dy', 'fx', 'fy', 'k', 'k1', 'k2', 'k3', 'k4',
	'tabIndex', 'strokeWidth', 'strokeMiterlimit', 'strokeOpacity',
	'fillOpacity', 'opacity', 'fontSize',
] );

/**
 * Convert SVG attributes to JSX attribute string.
 *
 * @param {NamedNodeMap} attributes - Element attributes.
 * @return {string} JSX attributes string.
 */
function attrsToJsx( attributes ) {
	return Array.from( attributes )
		.map( ( attr ) => {
			const name = camelCaseAttr( attr.name );
			const value = attr.value;

			if ( value === 'true' ) return ` ${ name }`;
			if ( value === 'false' ) return ` ${ name }={false}`;
			if ( NUMERIC_ATTRS.has( name ) && value.trim() !== '' && ! isNaN( Number( value ) ) ) {
				return ` ${ name }={${ value }}`;
			}

			return ` ${ name }="${ value }"`;
		} )
		.join( '' );
}

/**
 * Convert SVG attribute name to camelCase for JSX.
 *
 * @param {string} attrName - SVG attribute name.
 * @return {string} camelCase attribute name.
 */
function camelCaseAttr( attrName ) {
	// Known JSX attribute name mappings.
	const JSX_ATTR_MAP = {
		class: 'className',
		'clip-path': 'clipPath',
		'clip-rule': 'clipRule',
		'fill-opacity': 'fillOpacity',
		'fill-rule': 'fillRule',
		'font-family': 'fontFamily',
		'font-size': 'fontSize',
		'font-weight': 'fontWeight',
		'stroke-dasharray': 'strokeDasharray',
		'stroke-dashoffset': 'strokeDashoffset',
		'stroke-linecap': 'strokeLinecap',
		'stroke-linejoin': 'strokeLinejoin',
		'stroke-miterlimit': 'strokeMiterlimit',
		'stroke-opacity': 'strokeOpacity',
		'stroke-width': 'strokeWidth',
		'text-anchor': 'textAnchor',
		'xlink:href': 'xlinkHref',
		'xml:space': 'xmlSpace',
		'xmlns:xlink': 'xmlnsXlink',
	};

	return JSX_ATTR_MAP[ attrName ] || attrName;
}
