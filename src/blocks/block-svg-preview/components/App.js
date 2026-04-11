import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { parseSvg } from '../../../utilities/parse-svg';
import { sanitizeSvgString } from '../../../utilities/sanitize-svg';

export default function App() {
	const [ svgInput, setSvgInput ] = useState( '' );
	const [ previewHtml, setPreviewHtml ] = useState( null );
	const [ processError, setProcessError ] = useState( null );
	const [ isProcessing, setIsProcessing ] = useState( false );

	const handleProcess = async () => {
		setProcessError( null );
		setPreviewHtml( null );

		const parsed = parseSvg( svgInput );
		if ( ! parsed.svg || parsed.error ) {
			setProcessError(
				parsed.error ||
					__( 'Could not parse SVG.', 'wp-block-icon-preview' )
			);
			return;
		}

		setIsProcessing( true );
		try {
			const out = await sanitizeSvgString( parsed.svg.outerHTML );
			setPreviewHtml( out );
		} catch ( err ) {
			const message =
				err instanceof Error
					? err.message
					: __( 'Processing failed.', 'wp-block-icon-preview' );
			setProcessError( message );
		} finally {
			setIsProcessing( false );
		}
	};

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
			<p>
				<button
					type="button"
					className="wp-block-icon-preview__process"
					onClick={ handleProcess }
					disabled={ isProcessing || ! svgInput.trim() }
				>
					{ isProcessing
						? __( 'Processing…', 'wp-block-icon-preview' )
						: __( 'Process SVG', 'wp-block-icon-preview' ) }
				</button>
			</p>
			{ processError && (
				<p className="wp-block-icon-preview__error" role="alert">
					{ processError }
				</p>
			) }
			{ previewHtml && (
				<div className="wp-block-icon-preview__preview">
					<h3>{ __( 'Preview', 'wp-block-icon-preview' ) }</h3>
					<div
						className="wp-block-icon-preview__preview-output"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={ { __html: previewHtml } }
					/>
				</div>
			) }
		</div>
	);
}
