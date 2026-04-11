/**
 * Public entry for the SVG pipeline. Heavy dependencies (SVGO, DOMPurify, @svgr/core) live in
 * process-svg-impl.js and load on first use via import().
 *
 * The webpackChunkName must match the entry folder (block-svg-preview/), not blocks/…/ which
 * @wordpress/scripts maps to a different build path than view.js. Mismatched folders 404 the
 * chunk and the dynamic import fails (“is not a function”).
 */

/** @type {Promise<typeof import('./process-svg-impl.js')>|null} */
let implModulePromise = null;

/**
 * @return {Promise<typeof import('./process-svg-impl.js')>}
 */
function loadProcessSvgImpl() {
	if ( ! implModulePromise ) {
		implModulePromise = import(
			/* webpackChunkName: "block-svg-preview/svg-pipeline" */
			/* webpackPrefetch: true */
			'./process-svg-impl.js'
		);
	}
	return implModulePromise;
}

/**
 * @param {string} rawString - User-pasted SVG.
 * @param {Object} [options]
 * @param {string} [options.componentName='BlockIcon'] - Name for TSX/JSX output.
 * @return {Promise<Object>} Result with ok flag and payloads.
 */
export async function processSvgInput( rawString, options = {} ) {
	const impl = await loadProcessSvgImpl();
	return impl.processSvgInput( rawString, options );
}
