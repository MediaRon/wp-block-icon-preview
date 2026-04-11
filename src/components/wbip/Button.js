/**
 * Primary / secondary button (scoped styles under .wbip-app).
 */

/**
 * @param {Object} props
 * @param {string} [props.variant='primary'] - primary | secondary | subtle.
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 * @param {Object} [props.buttonProps] - Extra button attributes.
 */
export function WbipButton( {
	variant = 'primary',
	className = '',
	children,
	...buttonProps
} ) {
	const variantClass = `wbip-button--${ variant }`;
	return (
		<button
			type="button"
			className={ `wbip-button ${ variantClass } ${ className }`.trim() }
			{ ...buttonProps }
		>
			{ children }
		</button>
	);
}
