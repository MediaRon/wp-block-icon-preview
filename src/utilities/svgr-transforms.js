/**
 * Barrel for SVGR entry points only. Imported via dynamic import() so it becomes its own chunk
 * separate from DOMPurify/SVGO (sanitize-svg.js).
 */

export { toJsx } from './to-jsx';
export { toTsx } from './to-tsx';
