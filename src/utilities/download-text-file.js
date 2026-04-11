/**
 * Trigger a file download in the browser.
 *
 * @param {string} filename - File name including extension.
 * @param {string} text     - File body.
 * @param {string} [mimeType='text/plain;charset=utf-8'] - MIME type.
 */
export function downloadTextFile(
	filename,
	text,
	mimeType = 'text/plain;charset=utf-8'
) {
	const blob = new Blob( [ text ], { type: mimeType } );
	const url = URL.createObjectURL( blob );
	const anchor = document.createElement( 'a' );
	anchor.href = url;
	anchor.download = filename;
	anchor.rel = 'noopener';
	anchor.style.display = 'none';
	document.body.appendChild( anchor );
	anchor.click();
	document.body.removeChild( anchor );
	URL.revokeObjectURL( url );
}
