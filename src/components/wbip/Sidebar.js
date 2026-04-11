/**
 * Sidebar: SVG status, previews, diagnostics, exports.
 */

import { __, sprintf } from '@wordpress/i18n';
import { useId } from '@wordpress/element';
import { downloadTextFile } from '../../utilities/download-text-file';
import { sanitizeComponentName } from '../../utilities/svgr-shared-config';
import { WbipButton } from './Button';
import { WbipCopyButton } from './CopyButton';

/**
 * @param {Object} props
 * @param {Object|null} props.result - Successful processSvgInput payload (ok true).
 */
export function WbipSidebar( { result } ) {
	const baseId = useId().replace( /[^a-zA-Z0-9_-]/g, '-' );

	if ( ! result ) {
		return (
			<p className="wbip-sidebar__empty">
				{ __(
					'Process an SVG to see status, previews, and exports.',
					'wp-block-icon-preview'
				) }
			</p>
		);
	}

	const {
		sanitizedSvg,
		orgPreviewSvg,
		preMetrics,
		strippedInlineStyleCount,
		verdict,
		jsx,
		tsx,
		blockJsonEscapedInner,
		reactTransformOk,
		reactTransformError,
		parse,
		componentName: rawComponentName,
	} = result;

	const safeName = sanitizeComponentName( rawComponentName || 'BlockIcon' );

	const handleDownloadJsx = () => {
		if ( jsx ) {
			downloadTextFile( `${ safeName }.jsx`, jsx );
		}
	};

	const handleDownloadTsx = () => {
		if ( tsx ) {
			downloadTextFile( `${ safeName }.tsx`, tsx );
		}
	};

	const verdictLabel =
		verdict === 'safe'
			? __( 'Safe', 'wp-block-icon-preview' )
			: verdict === 'risky'
			? __( 'Risky', 'wp-block-icon-preview' )
			: __( 'Likely to break', 'wp-block-icon-preview' );

	const toolbarTitleId = `wbip-toolbar-${ baseId }`;
	const orgTitleId = `wbip-org-${ baseId }`;
	const diagTitleId = `wbip-diag-${ baseId }`;
	const outTitleId = `wbip-out-${ baseId }`;
	const blockJsonFieldId = `wbip-bj-${ baseId }`;

	const hasDiagNotes =
		! preMetrics.hasViewBox ||
		parse.hasXmlDeclaration ||
		parse.hasDoctype ||
		preMetrics.distinctFillCount > 1 ||
		preMetrics.pathCount > 10 ||
		preMetrics.incompatibleElementCount > 0;

	return (
		<div className="wbip-sidebar">
			<details className="wbip-card wbip-card--status" open>
				<summary className="wbip-card__summary">
					<span className="wbip-section-heading">
						{ __( 'SVG Status', 'wp-block-icon-preview' ) }
					</span>
					<span
						className={ `wbip-status-badge wbip-status-badge--${ verdict }` }
					>
						{ verdictLabel }
					</span>
				</summary>
				<ul className="wbip-status-list">
					<li
						className={
							preMetrics.incompatibleElementCount > 0
								? 'wbip-status-list__item wbip-status-list__item--err'
								: 'wbip-status-list__item wbip-status-list__item--neutral'
						}
					>
						{ sprintf(
							/* translators: %d: Number of unsupported elements for simple .org icons. */
							__( 'Incompatible .org elements: %d', 'wp-block-icon-preview' ),
							preMetrics.incompatibleElementCount
						) }
					</li>
					<li
						className={
							reactTransformOk
								? 'wbip-status-list__item wbip-status-list__item--ok'
								: 'wbip-status-list__item wbip-status-list__item--err'
						}
					>
						{ reactTransformOk
							? __(
									'SVGR: JSX/TSX generated with no errors.',
									'wp-block-icon-preview'
							  )
							: sprintf(
									/* translators: %s: SVGR error message. */
									__( 'SVGR error: %s', 'wp-block-icon-preview' ),
									reactTransformError || ''
							  ) }
					</li>
					<li
						className={
							strippedInlineStyleCount > 0
								? 'wbip-status-list__item wbip-status-list__item--warn'
								: 'wbip-status-list__item wbip-status-list__item--neutral'
						}
					>
						{ sprintf(
							/* translators: %d: Number of inline style attributes removed or normalized. */
							__(
								'Inline styles stripped for .org SVG: %d',
								'wp-block-icon-preview'
							),
							strippedInlineStyleCount
						) }
					</li>
				</ul>
			</details>

			<div className="wbip-preview-stack">
				<section className="wbip-card" aria-labelledby={ toolbarTitleId }>
					<h3 className="wbip-section-heading" id={ toolbarTitleId }>
						{ __( 'Toolbar Preview', 'wp-block-icon-preview' ) }
					</h3>
					<div className="wbip-preview-toolbar">
						<span
							className="wbip-preview-toolbar__icon"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={ { __html: sanitizedSvg } }
						/>
						<span className="wbip-preview-toolbar__text">
							<span className="wbip-preview-toolbar__title">
								{ __( 'WP Block Icon Preview', 'wp-block-icon-preview' ) }
							</span>
							<span className="wbip-preview-toolbar__sub">
								{ __( 'Preview text', 'wp-block-icon-preview' ) }
							</span>
						</span>
					</div>
				</section>

				<section className="wbip-card" aria-labelledby={ orgTitleId }>
					<h3 className="wbip-section-heading wbip-section-heading--link" id={ orgTitleId }>
						{ __( 'WordPress.org Preview', 'wp-block-icon-preview' ) }
					</h3>
					<p className="wbip-preview-org__hint">
						{ __(
							'Shows only svg, g, and path (elements like circle are hidden here).',
							'wp-block-icon-preview'
						) }
					</p>
					<div className="wbip-preview-org">
						<div
							className="wbip-preview-org__icon"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={ {
								__html: orgPreviewSvg || sanitizedSvg,
							} }
						/>
						<div className="wbip-preview-org__body">
							<div className="wbip-preview-org__title">
								{ __( 'Block name', 'wp-block-icon-preview' ) }
							</div>
							<div className="wbip-preview-org__desc">
								{ __( 'Sample description text', 'wp-block-icon-preview' ) }
							</div>
						</div>
					</div>
				</section>
			</div>

			<section className="wbip-card" aria-labelledby={ diagTitleId }>
				<h3 className="wbip-section-heading" id={ diagTitleId }>
					{ __( 'Diagnostics', 'wp-block-icon-preview' ) }
				</h3>
				<ul className="wbip-issue-list">
					{ preMetrics.incompatibleElementCount > 0 && (
						<li className="wbip-issue-list__item wbip-issue-list__item--warn">
							{ sprintf(
								/* translators: %d: Count of elements outside svg/g/path. */
								__(
									'Found %d element(s) outside the simple svg / g / path shape recommended for .org block icons.',
									'wp-block-icon-preview'
								),
								preMetrics.incompatibleElementCount
							) }
						</li>
					) }
					{ ! preMetrics.hasViewBox && (
						<li className="wbip-issue-list__item wbip-issue-list__item--warn">
							{ __(
								'Missing viewBox on root SVG (needed for reliable scaling).',
								'wp-block-icon-preview'
							) }
						</li>
					) }
					{ parse.hasXmlDeclaration && (
						<li className="wbip-issue-list__item wbip-issue-list__item--info">
							{ __(
								'XML declaration present; removed in sanitized output.',
								'wp-block-icon-preview'
							) }
						</li>
					) }
					{ parse.hasDoctype && (
						<li className="wbip-issue-list__item wbip-issue-list__item--info">
							{ __(
								'DOCTYPE present; removed in sanitized output.',
								'wp-block-icon-preview'
							) }
						</li>
					) }
					{ preMetrics.distinctFillCount > 1 && (
						<li className="wbip-issue-list__item wbip-issue-list__item--warn">
							{ sprintf(
								/* translators: %d: Distinct fill values count. */
								__(
									'Multiple fill colors detected (%d). Icons often use a single color or currentColor.',
									'wp-block-icon-preview'
								),
								preMetrics.distinctFillCount
							) }
						</li>
					) }
					{ preMetrics.pathCount > 10 && (
						<li className="wbip-issue-list__item wbip-issue-list__item--warn">
							{ sprintf(
								/* translators: %d: Path element count. */
								__(
									'High path count (%d); may be heavy for a block icon.',
									'wp-block-icon-preview'
								),
								preMetrics.pathCount
							) }
						</li>
					) }
					{ ! hasDiagNotes && (
						<li className="wbip-issue-list__item wbip-issue-list__item--ok">
							{ __(
								'No major structural issues detected.',
								'wp-block-icon-preview'
							) }
						</li>
					) }
				</ul>
			</section>

			<section className="wbip-card wbip-card--output" aria-labelledby={ outTitleId }>
				<h3 className="wbip-section-heading" id={ outTitleId }>
					{ __( 'Download', 'wp-block-icon-preview' ) }
				</h3>
				<div className="wbip-output-actions">
					<WbipButton
						variant="primary"
						onClick={ handleDownloadJsx }
						disabled={ ! jsx }
					>
						{ __( 'Download as JSX', 'wp-block-icon-preview' ) }
					</WbipButton>
					<WbipButton
						variant="primary"
						onClick={ handleDownloadTsx }
						disabled={ ! tsx }
					>
						{ __( 'Download as TSX', 'wp-block-icon-preview' ) }
					</WbipButton>
				</div>
				<details className="wbip-code-details">
					<summary>{ __( 'Show generated JSX', 'wp-block-icon-preview' ) }</summary>
					<pre className="wbip-code">{ jsx || '—' }</pre>
				</details>
				<details className="wbip-code-details">
					<summary>{ __( 'Show generated TSX', 'wp-block-icon-preview' ) }</summary>
					<pre className="wbip-code">{ tsx || '—' }</pre>
				</details>

				<h3 className="wbip-section-heading wbip-section-heading--spaced">
					{ __( 'Copy Block.json SVG', 'wp-block-icon-preview' ) }
				</h3>
				<label className="wbip-sr-only" htmlFor={ blockJsonFieldId }>
					{ __( 'Escaped SVG for block.json', 'wp-block-icon-preview' ) }
				</label>
				<input
					id={ blockJsonFieldId }
					className="wbip-block-json-input"
					type="text"
					readOnly
					value={ blockJsonEscapedInner }
				/>
				<WbipCopyButton
					className="wbip-copy-block-json"
					textToCopy={ blockJsonEscapedInner }
					label={ __( 'Copy Block.json SVG', 'wp-block-icon-preview' ) }
				/>
			</section>
		</div>
	);
}
