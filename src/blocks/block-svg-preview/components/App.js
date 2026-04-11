import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { processSvgInput } from '../../../utilities/process-svg';

export default function App() {
	const [ svgInput, setSvgInput ] = useState( '' );
	const [ previewHtml, setPreviewHtml ] = useState( null );
	const [ jsxOut, setJsxOut ] = useState( '' );
	const [ tsxOut, setTsxOut ] = useState( '' );
	const [ blockJsonEscaped, setBlockJsonEscaped ] = useState( '' );
	const [ reactStatus, setReactStatus ] = useState( null );
	const [ processError, setProcessError ] = useState( null );
	const [ isProcessing, setIsProcessing ] = useState( false );

	const handleProcess = async () => {
		setProcessError( null );
		setPreviewHtml( null );
		setJsxOut( '' );
		setTsxOut( '' );
		setBlockJsonEscaped( '' );
		setReactStatus( null );

		setIsProcessing( true );
		try {
			const result = await processSvgInput( svgInput );
			if ( ! result.ok ) {
				setProcessError( result.error );
				return;
			}
			setPreviewHtml( result.sanitizedSvg );
			setJsxOut( result.jsx );
			setTsxOut( result.tsx );
			setBlockJsonEscaped( result.blockJsonEscapedInner );
			setReactStatus( {
				ok: result.reactTransformOk,
				error: result.reactTransformError,
			} );
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
			{ reactStatus && (
				<p
					className={
						reactStatus.ok
							? 'wp-block-icon-preview__react-ok'
							: 'wp-block-icon-preview__react-err'
					}
					role="status"
				>
					{ reactStatus.ok
						? __(
								'SVGR: JSX/TSX generated with no errors.',
								'wp-block-icon-preview'
						  )
						: sprintf(
								/* translators: %s: Technical error message from SVGR. */
								__( 'SVGR error: %s', 'wp-block-icon-preview' ),
								reactStatus.error || ''
						  ) }
				</p>
			) }
			{ previewHtml && (
				<div className="wp-block-icon-preview__preview">
					<h3>{ __( 'Sanitized preview', 'wp-block-icon-preview' ) }</h3>
					<div
						className="wp-block-icon-preview__preview-output"
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={ { __html: previewHtml } }
					/>
				</div>
			) }
			{ blockJsonEscaped && (
				<div className="wp-block-icon-preview__export">
					<h3>{ __( 'block.json icon (escaped)', 'wp-block-icon-preview' ) }</h3>
					<pre className="wp-block-icon-preview__code">
						{ blockJsonEscaped }
					</pre>
				</div>
			) }
			{ jsxOut && (
				<div className="wp-block-icon-preview__export">
					<h3>{ __( 'JSX (SVGR)', 'wp-block-icon-preview' ) }</h3>
					<pre className="wp-block-icon-preview__code">{ jsxOut }</pre>
				</div>
			) }
			{ tsxOut && (
				<div className="wp-block-icon-preview__export">
					<h3>{ __( 'TSX (SVGR)', 'wp-block-icon-preview' ) }</h3>
					<pre className="wp-block-icon-preview__code">{ tsxOut }</pre>
				</div>
			) }
		</div>
	);
}
