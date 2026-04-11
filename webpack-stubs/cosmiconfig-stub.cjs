/**
 * Browser stub: @svgr/core only needs this when runtimeConfig and filePath are unused.
 * Replaces `cosmiconfig` so webpack never pulls `fs` / `fs/promises`.
 */

'use strict';

function cosmiconfig() {
	return {
		search: async () => null,
		load: async () => {
			throw new Error( 'cosmiconfig stub: load not used' );
		},
	};
}

function cosmiconfigSync() {
	return {
		search: () => null,
		load: () => {
			throw new Error( 'cosmiconfig stub: load not used' );
		},
	};
}

module.exports = { cosmiconfig, cosmiconfigSync };
