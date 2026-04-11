/**
 * Run diagnostics on an SVG element and return warnings/info.
 *
 * @param {SVGElement} svgElement - SVG element to diagnose.
 * @return {Array<{type: string, message: string}>} Array of diagnostic messages.
 */
export function runDiagnostics( svgElement ) {
	const messages = [];

	if ( ! svgElement ) {
		return [ { type: 'error', message: 'No valid SVG element provided.' } ];
	}

	// Check for viewBox.
	if ( ! svgElement.hasAttribute( 'viewBox' ) ) {
		messages.push( {
			type: 'warning',
			message: 'SVG is missing a viewBox attribute. This may cause sizing issues in WordPress blocks.',
		} );
	}

	// Check for fixed width/height without viewBox.
	if (
		( svgElement.hasAttribute( 'width' ) || svgElement.hasAttribute( 'height' ) ) &&
		! svgElement.hasAttribute( 'viewBox' )
	) {
		messages.push( {
			type: 'warning',
			message: 'SVG has fixed width/height but no viewBox. Consider adding a viewBox for scalability.',
		} );
	}

	// Check for inline scripts.
	const scripts = svgElement.querySelectorAll( 'script' );
	if ( scripts.length > 0 ) {
		messages.push( {
			type: 'error',
			message: `SVG contains ${ scripts.length } <script> element(s) which will be removed during sanitization.`,
		} );
	}

	// Check for event handlers.
	const allElements = [ svgElement, ...svgElement.querySelectorAll( '*' ) ];
	let eventHandlerCount = 0;
	allElements.forEach( ( el ) => {
		Array.from( el.attributes ).forEach( ( attr ) => {
			if ( attr.name.toLowerCase().startsWith( 'on' ) ) {
				eventHandlerCount++;
			}
		} );
	} );

	if ( eventHandlerCount > 0 ) {
		messages.push( {
			type: 'error',
			message: `SVG contains ${ eventHandlerCount } event handler attribute(s) which will be removed during sanitization.`,
		} );
	}

	// Check for external references.
	const useElements = svgElement.querySelectorAll( 'use' );
	useElements.forEach( ( useEl ) => {
		const href = useEl.getAttribute( 'href' ) || useEl.getAttribute( 'xlink:href' );
		if ( href && ( href.startsWith( 'http' ) || href.startsWith( '//' ) ) ) {
			messages.push( {
				type: 'warning',
				message: 'SVG contains external <use> references which may not render in WordPress.',
			} );
		}
	} );

	if ( messages.length === 0 ) {
		messages.push( {
			type: 'info',
			message: 'SVG looks compatible with WordPress block icons.',
		} );
	}

	return messages;
}
