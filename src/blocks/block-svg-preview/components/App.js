import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { processSvgInput } from '../../../utilities/process-svg';
import { WbipAppLayout } from '../../../components/wbip/AppLayout';
import { WbipSidebar } from '../../../components/wbip/Sidebar';
import { WbipButton } from '../../../components/wbip/Button';

export default function App() {
	const [ svgInput, setSvgInput ] = useState( '' );
	const [ componentName, setComponentName ] = useState( 'BlockIcon' );
	const [ processResult, setProcessResult ] = useState( null );
	const [ processError, setProcessError ] = useState( null );
	const [ isProcessing, setIsProcessing ] = useState( false );

	const handleProcess = async () => {
		setProcessError( null );
		setProcessResult( null );

		setIsProcessing( true );
		try {
			const result = await processSvgInput( svgInput, {
				componentName: componentName.trim() || 'BlockIcon',
			} );
			if ( ! result.ok ) {
				setProcessError( result.error );
				return;
			}
			setProcessResult( result );
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

	const mainColumn = (
		<div className="wbip-main">
			<h2 className="wbip-app__title">
				{ __( 'WP Block Icon Preview', 'wp-block-icon-preview' ) }
			</h2>
			<p className="wbip-app__lede">
				{ __(
					'Paste SVG, then process to sanitize, preview, and export for blocks.',
					'wp-block-icon-preview'
				) }
			</p>
			<div className="wbip-input-panel">
				<label className="wbip-input-panel__label" htmlFor="wbip-svg-input">
					{ __( 'Paste SVG Code Here:', 'wp-block-icon-preview' ) }
				</label>
				<textarea
					id="wbip-svg-input"
					className="wbip-code-textarea"
					placeholder={ __( 'Paste SVG code here…', 'wp-block-icon-preview' ) }
					value={ svgInput }
					onChange={ ( e ) => setSvgInput( e.target.value ) }
					rows={ 12 }
					spellCheck={ false }
				/>
			</div>
			<div className="wbip-input-panel wbip-input-panel--compact">
				<label className="wbip-input-panel__label" htmlFor="wbip-component-name">
					{ __( 'Component name (for JSX/TSX files)', 'wp-block-icon-preview' ) }
				</label>
				<input
					id="wbip-component-name"
					className="wbip-block-json-input"
					type="text"
					value={ componentName }
					onChange={ ( e ) => setComponentName( e.target.value ) }
					autoComplete="off"
				/>
			</div>
			<div className="wbip-main-actions">
				<WbipButton
					variant="primary"
					onClick={ handleProcess }
					disabled={ isProcessing || ! svgInput.trim() }
				>
					{ isProcessing
						? __( 'Processing…', 'wp-block-icon-preview' )
						: __( 'Process SVG', 'wp-block-icon-preview' ) }
				</WbipButton>
			</div>
			{ processError && (
				<p className="wbip-alert" role="alert">
					{ processError }
				</p>
			) }
		</div>
	);

	return (
		<div className="wp-block-icon-preview__app-inner">
			<div className="wbip-app">
				<WbipAppLayout
					main={ mainColumn }
					sidebar={ <WbipSidebar result={ processResult } /> }
				/>
			</div>
		</div>
	);
}
