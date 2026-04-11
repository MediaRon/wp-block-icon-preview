<?php
/**
 * Main plugin class.
 *
 * @package DLXPlugins\WPBlockIconPreview
 */

namespace DLXPlugins\WPBlockIconPreview;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin bootstrap class.
 */
class Plugin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
	}

	/**
	 * Register blocks.
	 */
	public function register_blocks() {
		if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
			
			wp_register_block_types_from_metadata_collection( WP_BLOCK_ICON_PREVIEW_DIR . 'build/',
				WP_BLOCK_ICON_PREVIEW_DIR . 'build/blocks-manifest.php'
			);
			return;
		}

		register_block_type( WP_BLOCK_ICON_PREVIEW_DIR . 'build/block/' );
	}
}
