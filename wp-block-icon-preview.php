<?php
/**
 * Plugin Name: WP Block Icon Preview
 * Plugin URI:  https://dlxplugins.com
 * Description: A developer utility block for previewing and sanitizing SVG block icons.
 * Version:     1.0.0
 * Author:      DLXPlugins
 * Author URI:  https://dlxplugins.com
 * Text Domain: wp-block-icon-preview
 * Requires at least: 6.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 *
 * @package DLXPlugins\WPBlockIconPreview
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WP_BLOCK_ICON_PREVIEW_VERSION', '1.0.0' );
define( 'WP_BLOCK_ICON_PREVIEW_FILE', __FILE__ );
define( 'WP_BLOCK_ICON_PREVIEW_DIR', plugin_dir_path( __FILE__ ) );
define( 'WP_BLOCK_ICON_PREVIEW_URL', plugin_dir_url( __FILE__ ) );

require_once WP_BLOCK_ICON_PREVIEW_DIR . 'vendor/autoload.php';

add_action(
	'plugins_loaded',
	function () {
		new \DLXPlugins\WPBlockIconPreview\Plugin();
	}
);
