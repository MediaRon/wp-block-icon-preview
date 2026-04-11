import { __ } from '@wordpress/i18n';

export default function Render() {
	return (
		<div
			className="wp-block-icon-preview__app"
			data-wp-interactive="wp-block-icon-preview"
		>
			<p className="wp-block-icon-preview__loading">
				{ __(
					'Loading WP Block Icon Preview…',
					'wp-block-icon-preview'
				) }
			</p>
		</div>
	);
}
