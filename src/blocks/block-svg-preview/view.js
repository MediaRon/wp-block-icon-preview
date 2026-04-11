/**
 * WordPress Block Icon Preview - Frontend View Script
 *
 * This script runs on the frontend when the block is displayed.
 */

import { createRoot } from '@wordpress/element';
import App from './components/App';

const containers = document.querySelectorAll( '.wp-block-icon-preview__app' );
containers.forEach( ( container ) => {
	const root = createRoot( container );
	root.render( <App /> );
} );
