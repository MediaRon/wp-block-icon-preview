/**
 * WordPress Scripts webpack extension: SVGR (@svgr/core) depends on cosmiconfig → fs.
 * Alias cosmiconfig to a stub and disable Node polyfills SVGR/Babel should not need at runtime.
 */

const path = require( 'path' );
const webpack = require( 'webpack' );
const wpScriptsConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * @param {import('webpack').Configuration} config
 * @return {import('webpack').Configuration}
 */
function patchConfig( config ) {
	const split = config.optimization?.splitChunks || {};
	const cacheGroups = { ...( split.cacheGroups || {} ) };

	// Split async-only vendors into readable chunks beside the block (not one huge numeric file).
	Object.assign( cacheGroups, {
		wbipDompurify: {
			test: /[\\/]node_modules[\\/]dompurify[\\/]/,
			name: 'block-svg-preview/vendor-dompurify',
			chunks: 'async',
			priority: 45,
			enforce: true,
		},
		wbipSvgoStack: {
			test: /[\\/]node_modules[\\/](svgo|css-tree|csso|mdn-data|source-map-js|boolbase|stable|util-deprecate|commander)[\\/]/,
			name: 'block-svg-preview/vendor-svgo-stack',
			chunks: 'async',
			priority: 44,
			enforce: true,
		},
		wbipSvgAst: {
			test: /[\\/]node_modules[\\/](svg-parser|hast-util|unist-util|property-information|comma-separated-tokens|space-separated-tokens|web-namespaces|entities|bcp-47-match|bcp-47|decode-named-character-reference|character-entities|character-reference-invalid|is-alphabetical|is-alphanumerical|is-decimal|is-hexadecimal|character-entities-legacy)[\\/]/,
			name: 'block-svg-preview/vendor-svg-ast',
			chunks: 'async',
			priority: 42,
			enforce: true,
		},
		wbipSvgrStack: {
			test: /[\\/]node_modules[\\/](@svgr|@babel)[\\/]/,
			name: 'block-svg-preview/vendor-svgr-stack',
			chunks: 'async',
			priority: 41,
			enforce: true,
		},
	} );

	return {
		...config,
		output: {
			...config.output,
			// Helps async import() resolve chunk URLs from the script that loaded the entry.
			publicPath: config.output?.publicPath ?? 'auto',
		},
		optimization: {
			...config.optimization,
			splitChunks: {
				...split,
				cacheGroups,
			},
		},
		resolve: {
			...config.resolve,
			alias: {
				...( config.resolve && config.resolve.alias ),
				cosmiconfig: path.resolve(
					__dirname,
					'webpack-stubs/cosmiconfig-stub.cjs'
				),
			},
			fallback: {
				...( config.resolve && config.resolve.fallback ),
				fs: false,
				'fs/promises': false,
				path: require.resolve( 'path-browserify' ),
				process: require.resolve( 'process/browser' ),
				os: false,
				module: false,
				assert: require.resolve( 'assert/' ),
			},
		},
		plugins: [
			...( config.plugins || [] ),
			new webpack.ProvidePlugin( {
				process: 'process/browser',
			} ),
		],
	};
}

module.exports = Array.isArray( wpScriptsConfig )
	? wpScriptsConfig.map( patchConfig )
	: patchConfig( wpScriptsConfig );
