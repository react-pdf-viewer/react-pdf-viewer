/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import zoomPlugin from './zoomPlugin';
export { default as ZoomInIcon } from './ZoomInIcon';
export { default as ZoomOutIcon } from './ZoomOutIcon';

export default zoomPlugin;

// Types
export type { CurrentScaleProps } from './CurrentScale';
export type { ZoomProps } from './Zoom';
export type { ZoomInProps } from './ZoomIn';
export type { ZoomOutProps } from './ZoomOut';
