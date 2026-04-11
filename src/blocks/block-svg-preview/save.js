import { useBlockProps } from '@wordpress/block-editor';
import Render from './render';

export default function save() {
	const blockProps = useBlockProps.save( {
		className: 'wp-block-icon-preview',
	} );

	return (
		<div { ...blockProps }>
			<Render />
		</div>
	);
}
