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
	return {
		...config,
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
