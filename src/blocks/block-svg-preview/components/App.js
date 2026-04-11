import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { parseSvg } from '../../../utilities/parse-svg';
import { sanitizeSvg } from '../../../utilities/sanitize-svg';

export default function App() {
	const [ svgInput, setSvgInput ] = useState( '' );

	const sanitizedSvgHtml = () => {
		const parsed = parseSvg( svgInput );
		if ( ! parsed ) {
			return null;
		}
		const sanitized = sanitizeSvg( parsed );
		if ( ! sanitized ) {
			return null;
		}
		return sanitized.outerHTML;
	};

	const svgHtml = svgInput ? sanitizedSvgHtml() : null;

	return (
		<div className="wp-block-icon-preview__app-inner">
			<h2>{ __( 'WP Block Icon Preview', 'wp-block-icon-preview' ) }</h2>
			<p>
				{ __(
					'Paste your SVG code below to preview it in WordPress-oriented contexts.',
					'wp-block-icon-preview'
				) }
			</p>
			<textarea
				className="wp-block-icon-preview__input"
				placeholder={ __( 'Paste SVG code here…', 'wp-block-icon-preview' ) }
				value={ svgInput }
				onChange={ ( e ) => setSvgInput( e.target.value ) }
				rows={ 8 }
			/>
			{ svgHtml && (
				<div className="wp-block-icon-preview__preview">
					<h3>{ __( 'Preview', 'wp-block-icon-preview' ) }</h3>
					<div
						className="wp-block-icon-preview__preview-output"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={ { __html: svgHtml } }
					/>
				</div>
			) }
		</div>
	);
}
