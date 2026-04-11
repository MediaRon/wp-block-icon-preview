/**
 * Derive sidebar verdict and numeric flags from process results (no user-facing strings).
 */

/**
 * @param {Object} args
 * @param {Object} args.preMetrics - From collectOrgMetrics.
 * @param {number} args.strippedInlineStyleCount
 * @param {boolean} args.reactTransformOk
 * @param {boolean} args.hasXmlDeclaration
 * @param {boolean} args.hasDoctype
 * @return {'safe'|'risky'|'fail'}
 */
export function deriveVerdict( {
	preMetrics,
	strippedInlineStyleCount,
	reactTransformOk,
	hasXmlDeclaration,
	hasDoctype,
} ) {
	const fail =
		preMetrics.incompatibleElementCount > 0 || ! preMetrics.hasViewBox;
	if ( fail ) {
		return 'fail';
	}
	const risky =
		preMetrics.distinctFillCount > 1 ||
		preMetrics.pathCount > 10 ||
		preMetrics.maxGroupNesting > 2 ||
		hasXmlDeclaration ||
		hasDoctype ||
		strippedInlineStyleCount > 0 ||
		! reactTransformOk;
	if ( risky ) {
		return 'risky';
	}
	return 'safe';
}
