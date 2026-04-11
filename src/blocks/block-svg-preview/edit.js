import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import './editor.scss';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'wp-block-icon-preview-editor',
	} );

	return (
		<div { ...blockProps }>
			<div className="wp-block-icon-preview-editor__placeholder">
				<h3>{ __( 'WP Block Icon Preview', 'wp-block-icon-preview' ) }</h3>
				<p>
					{ __(
						'Paste your SVG code on the frontend to preview, sanitize, and export it as JSX, TSX, or block.json format.',
						'wp-block-icon-preview'
					) }
				</p>
			</div>
		</div>
	);
}
