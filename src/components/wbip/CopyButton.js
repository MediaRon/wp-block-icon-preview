/**
 * Copy text to clipboard with brief confirmation.
 */

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * @param {Object} props
 * @param {string} props.textToCopy - String to place on the clipboard.
 * @param {string} props.label - Default button label.
 * @param {string} [props.className]
 */
export function WbipCopyButton( { textToCopy, label, className = '' } ) {
	const [ copied, setCopied ] = useState( false );

	const handleClick = async () => {
		try {
			await navigator.clipboard.writeText( textToCopy );
			setCopied( true );
			window.setTimeout( () => setCopied( false ), 2000 );
		} catch {
			setCopied( false );
		}
	};

	return (
		<button
			type="button"
			className={ `wbip-button wbip-button--primary wbip-copy-button ${ className }`.trim() }
			onClick={ handleClick }
			disabled={ ! textToCopy }
			aria-live="polite"
		>
			{ copied
				? __( 'Copied', 'wp-block-icon-preview' )
				: label }
		</button>
	);
}
